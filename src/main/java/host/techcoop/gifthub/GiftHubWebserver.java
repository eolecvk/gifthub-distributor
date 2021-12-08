package host.techcoop.gifthub;

import static spark.Spark.*;

import com.google.common.base.Strings;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Voter;
import host.techcoop.gifthub.domain.exceptions.PermissionsException;
import host.techcoop.gifthub.domain.exceptions.RoomJoinException;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.domain.requests.CreateRoomRequest;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;
import host.techcoop.gifthub.domain.requests.UpdateRequest;
import host.techcoop.gifthub.domain.requests.VoterJoinRequest;
import host.techcoop.gifthub.domain.responses.RoomInfoResponse;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map.Entry;
import lombok.SneakyThrows;
import spark.Request;
import spark.Response;

@Singleton
public class GiftHubWebserver {
  private static final boolean CACHE_DISABLED = false;
  private static final String SESSION_ROOM_KEY = "room";
  private static final String SESSION_VOTER_ID_KEY = "voter_id";

  private final GiftHubRoomDAO roomDAO;
  private final Gson gson;
  private final LoadingCache<GiftHubRoom, String> gsonRoomCache =
      CacheBuilder.newBuilder()
          .weakKeys()
          .build(
              new CacheLoader<GiftHubRoom, String>() {
                @Override
                public String load(GiftHubRoom giftHubRoom) throws Exception {
                  return gson.toJson(RoomInfoResponse.from(giftHubRoom));
                }
              });

  @Inject
  GiftHubWebserver(GiftHubRoomDAO roomDAO, Gson gson) {
    this.roomDAO = roomDAO;
    this.gson = gson;
  }

  public void init() {
    configure();
    route();
  }

  public void configure() {
    port(8080);
    staticFiles.location("/public");
  }

  public void route() {
    put("/api/:roomCode", this::processEvents, this::toRoomInfoResponse);
    post("/api/:roomCode/join", this::joinRoom, this::toRoomInfoResponse);
    post("/api/:roomCode/voterJoin", this::voterJoinRoom);
    post("/api/rooms", this::createRoom, this::toRoomInfoResponse);
    get("/api/:roomCode", this::getRoomInfo, this::toRoomInfoResponse);

    exception(
        RoomJoinException.class,
        (exception, request, response) -> {
          response.status(500);
          response.header("Content-Type", "application/json");
          response.body("{\"error\": \"That room does not exist\"}");
        });
    exception(
        PermissionsException.class,
        (exception, request, response) -> {
          response.status(403);
          response.header("Content-Type", "application/json");
          response.body("{\"error\": \"You do not have permission to view this room\"}");
        });
    exception(
        RuntimeException.class,
        (exception, request, response) -> {
          response.status(500);
          StringWriter out = new StringWriter();
          PrintWriter writer = new PrintWriter(out);
          exception.printStackTrace(writer);
          response.body(out.toString());
        });
  }

  private GiftHubRoom processEvents(Request request, Response response) {
    UpdateRequest voteRequest = gson.fromJson(request.body(), UpdateRequest.class);
    String roomCode = request.params(":roomCode");
    if (!request.session().attribute(SESSION_ROOM_KEY).equals(roomCode)) {
      throw new PermissionsException();
    }
    int voterId = request.session().attribute(SESSION_VOTER_ID_KEY);
    for (Event event : voteRequest.getEvents()) {
      event.apply(roomDAO, roomCode, voterId);
    }
    return roomDAO.getRoomByCode(roomCode);
  }

  private GiftHubRoom joinRoom(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    JoinRoomRequest joinRequest = gson.fromJson(request.body(), JoinRoomRequest.class);
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    request.session().attribute(SESSION_VOTER_ID_KEY, -1);
    return room;
  }

  private String voterJoinRoom(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    VoterJoinRequest joinRequest = gson.fromJson(request.body(), VoterJoinRequest.class);
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    Voter voter = null; // get voter from request
    if (!Strings.isNullOrEmpty(joinRequest.getPath())) {
      voter =
          room.getVotersById().entrySet().stream()
              .map(Entry::getValue)
              .filter(v -> v.getPath().equals(joinRequest.getPath()))
              .findFirst()
              .orElseThrow(RoomJoinException::new);
    } else if (!Strings.isNullOrEmpty(joinRequest.getName())) {
      voter = roomDAO.addVoterToRoom(roomCode, joinRequest.getName());
    }
    room = roomDAO.getRoomByCode(roomCode);
    request.session().attribute(SESSION_VOTER_ID_KEY, voter.getVoterId());
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    return buildJoinRoomResponse(voter, toRoomInfoResponse(room));
  }

  private GiftHubRoom createRoom(Request request, Response response) {
    CreateRoomRequest createRequest = gson.fromJson(request.body(), CreateRoomRequest.class);
    GiftHubRoom room =
        roomDAO.createRoom(createRequest.getSplittingCents(), createRequest.getRoomName());
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    request.session().attribute(SESSION_VOTER_ID_KEY, -1);
    return room;
  }

  private GiftHubRoom getRoomInfo(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    if (!request.session().attribute(SESSION_ROOM_KEY).equals(roomCode)) {
      throw new PermissionsException();
    }
    return roomDAO.getRoomByCode(roomCode);
  }

  @SneakyThrows
  private String toRoomInfoResponse(Object room) {
    if (CACHE_DISABLED) {
      return gson.toJson(RoomInfoResponse.buildTestInfo((GiftHubRoom) room));
    }
    return gsonRoomCache.get((GiftHubRoom) room);
  }

  private static String buildJoinRoomResponse(Voter voter, String roomInfo) {
    return new StringBuilder()
        .append("{\"voter_id\":")
        .append(voter.getVoterId())
        .append(",\"path\":\"")
        .append(voter.getPath())
        .append("\",\"room_info\":")
        .append(roomInfo)
        .append("}")
        .toString();
  }
}
