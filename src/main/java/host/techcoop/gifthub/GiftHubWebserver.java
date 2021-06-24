package host.techcoop.gifthub;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.domain.UserVote;
import host.techcoop.gifthub.domain.exceptions.RoomJoinException;
import host.techcoop.gifthub.domain.exceptions.VerificationException;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.domain.requests.CreateRoomRequest;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;
import host.techcoop.gifthub.domain.requests.UpdateRequest;
import host.techcoop.gifthub.domain.requests.events.AdjustEvent;
import host.techcoop.gifthub.domain.requests.events.EmotiveEvent;
import host.techcoop.gifthub.domain.requests.events.NeedsUpdateEvent;
import host.techcoop.gifthub.domain.responses.ErrorResponse;
import host.techcoop.gifthub.domain.responses.RoomInfoResponse;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import java.io.PrintWriter;
import java.io.StringWriter;
import spark.Request;
import spark.Response;

@Singleton
public class GiftHubWebserver {
  private static final String SESSION_ROOM_KEY = "room";
  private static final String SESSION_USER_ID_KEY = "user_id";

  private final GiftHubRoomDAO roomDAO;
  private final Gson gson;

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
    put("/api/:roomCode", this::processEvents, gson::toJson);
    post("/api/:roomCode/join", this::joinRoom, gson::toJson);
    post("/api/rooms", this::createRoom, gson::toJson);
    get("/api/:roomCode", this::getRoomInfo, gson::toJson);

    exception(
        RoomJoinException.class,
        (exception, request, response) -> {
          response.status(500);
          response.header("Content-Type", "application/json");
          response.body("{\"error\": \"That room does not exist\"}");
        });

    exception(
        VerificationException.class,
        (exception, request, response) -> {
          response.status(500);
          response.header("Content-Type", "application/json");
          response.body(gson.toJson(ErrorResponse.from(exception)));
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

  private Object processEvents(Request request, Response response) {
    UpdateRequest voteRequest = gson.fromJson(request.body(), UpdateRequest.class);
    String roomCode = request.params(":roomCode");
    int userId = request.session().attribute(SESSION_USER_ID_KEY);
    User oldUser = roomDAO.getUserFromRoom(roomCode, userId);
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    User user = oldUser;
    for (Event event : voteRequest.getEvents()) {
      switch (event.getKind()) {
        case ADJUST:
          AdjustEvent adjustEvent = (AdjustEvent) event;
          user =
              user.withUpdatedUserVote(
                  new UserVote(adjustEvent.getBarId(), adjustEvent.getNewValueCents()));
          break;
        case EMOTIVE:
          EmotiveEvent emotiveEvent = (EmotiveEvent) event;
          break;
        case NEEDS_UPDATE:
          NeedsUpdateEvent needsUpdateEvent = (NeedsUpdateEvent) event;
          User.UserBuilder userBuilder = user.toBuilder();
          if (!"".equals(needsUpdateEvent.getNeedsDescription())) {
            userBuilder.needsDescription(needsUpdateEvent.getNeedsDescription());
          }
          if (needsUpdateEvent.getNeedsUpperBoundCents() != null) {
            userBuilder.needsUpperBoundCents(needsUpdateEvent.getNeedsUpperBoundCents());
          }
          if (needsUpdateEvent.getNeedsLowerBoundCents() != null) {
            userBuilder.needsLowerBoundCents(needsUpdateEvent.getNeedsLowerBoundCents());
          }
          user = userBuilder.build();
          break;
      }
    }
    user.verify(oldUser, room);
    roomDAO.updateUserInRoom(roomCode, user);
    return null;
  }

  private RoomInfoResponse joinRoom(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    JoinRoomRequest joinRequest = gson.fromJson(request.body(), JoinRoomRequest.class);
    int userId = roomDAO.addUserToRoom(roomCode, joinRequest);
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    request.session().attribute(SESSION_USER_ID_KEY, userId);
    return RoomInfoResponse.from(room);
  }

  private RoomInfoResponse createRoom(Request request, Response response) {
    CreateRoomRequest createRequest = gson.fromJson(request.body(), CreateRoomRequest.class);
    GiftHubRoom room =
        roomDAO.createRoom(createRequest.getSplittingCents(), createRequest.getRoomName());
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    return RoomInfoResponse.from(room);
  }

  private RoomInfoResponse getRoomInfo(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    return RoomInfoResponse.from(room);
  }
}
