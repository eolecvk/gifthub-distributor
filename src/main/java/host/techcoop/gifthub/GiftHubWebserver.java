package host.techcoop.gifthub;

import static spark.Spark.*;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.EmotiveState;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.domain.UserVote;
import host.techcoop.gifthub.domain.exceptions.PermissionsException;
import host.techcoop.gifthub.domain.exceptions.RoomJoinException;
import host.techcoop.gifthub.domain.exceptions.VerificationException;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.domain.requests.CreateRoomRequest;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;
import host.techcoop.gifthub.domain.requests.UpdateRequest;
import host.techcoop.gifthub.domain.requests.events.AdjustEvent;
import host.techcoop.gifthub.domain.requests.events.EmotiveEvent;
import host.techcoop.gifthub.domain.requests.events.UserUpdateEvent;
import host.techcoop.gifthub.domain.responses.ErrorResponse;
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
    put("/api/:roomCode", this::processEvents);
    post("/api/:roomCode/join", this::joinRoom);
    post("/api/rooms", this::createRoom);
    get("/api/:roomCode", this::getRoomInfo);

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
    if (!request.session().attribute(SESSION_ROOM_KEY).equals(roomCode)) {
      throw new PermissionsException();
    }
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
          EmotiveState emotiveState =
              new EmotiveState(
                  emotiveEvent.getBarId(), user.getUserId(), emotiveEvent.getEmotion());
          switch (emotiveEvent.getToggle()) {
            case OFF:
              user = user.withRemovedEmotiveState(emotiveState);
              break;
            case ON:
              user =
                  user.withUpdatedEmotiveState(emotiveState)
                      .withRemovedEmotiveState(emotiveState.getOpposite());
              break;
          }
          break;
        case USER_UPDATE:
          UserUpdateEvent userUpdateEvent = (UserUpdateEvent) event;
          User.UserBuilder userBuilder = user.toBuilder();
          if (!"".equals(userUpdateEvent.getName())) {
            userBuilder.name(userUpdateEvent.getName());
          }          
          if (!"".equals(userUpdateEvent.getNeedsDescription())) {
            userBuilder.needsDescription(userUpdateEvent.getNeedsDescription());
          }
          if (userUpdateEvent.getNeedsUpperBoundCents() != null) {
            userBuilder.needsUpperBoundCents(userUpdateEvent.getNeedsUpperBoundCents());
          }
          if (userUpdateEvent.getNeedsLowerBoundCents() != null) {
            userBuilder.needsLowerBoundCents(userUpdateEvent.getNeedsLowerBoundCents());
          }
          user = userBuilder.build();
          break;
      }
    }
    user.verify(oldUser, room);
    roomDAO.updateUserInRoom(roomCode, user);
    return roomDAO.getRoomInfo(roomCode);
  }

  private String joinRoom(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    JoinRoomRequest joinRequest = gson.fromJson(request.body(), JoinRoomRequest.class);
    User user = User.EMPTY_USER;
    if (joinRequest.isParticipant()) {
      user = roomDAO.addUserToRoom(roomCode, joinRequest);
    }
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    if (!Strings.isNullOrEmpty(joinRequest.getPath())) {
      user =
          room.getPeople().stream()
              .filter(person -> person.getPath().equals(joinRequest.getPath()))
              .findFirst()
              .orElseThrow(() -> new RoomJoinException());
    }
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    request.session().attribute(SESSION_USER_ID_KEY, user.getUserId());
    return buildJoinRoomResponse(user, roomDAO.getRoomInfo(roomCode));
  }

  private String createRoom(Request request, Response response) {
    CreateRoomRequest createRequest = gson.fromJson(request.body(), CreateRoomRequest.class);
    GiftHubRoom room =
        roomDAO.createRoom(createRequest.getSplittingCents(), createRequest.getRoomName());
    request.session().attribute(SESSION_ROOM_KEY, room.getCode());
    return roomDAO.getRoomInfo(room.getCode());
  }

  private String getRoomInfo(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    if (!request.session().attribute(SESSION_ROOM_KEY).equals(roomCode)) {
      throw new PermissionsException();
    }
    return roomDAO.getRoomInfo(roomCode);
  }

  private static String buildJoinRoomResponse(User user, String roomInfo) {
    return new StringBuilder()
        .append("{\"user_id\":")
        .append(user.getUserId())
        .append(",\"path\":\"")
        .append(user.getPath())
        .append("\",\"room_info\":")
        .append(roomInfo)
        .append("}")
        .toString();
  }
}
