package host.techcoop.gifthub;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.requests.CreateGiftHubRoomRequest;
import host.techcoop.gifthub.domain.requests.VoteRequest;
import host.techcoop.gifthub.domain.responses.RoomInfoResponse;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import host.techcoop.gifthub.interfaces.UserDAO;
import spark.Request;
import spark.Response;

@Singleton
public class GiftHubWebserver {

  private final GiftHubRoomDAO roomDAO;
  private final UserDAO userDAO;
  private final Gson gson;

  @Inject
  GiftHubWebserver(GiftHubRoomDAO roomDAO, Gson gson, UserDAO userDAO) {
    this.userDAO = userDAO;
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
    get("/rooms/:roomCode", this::getRoomInfo);
    put("/rooms", this::createRoom);
    get("/rooms/join/:roomCode", this::joinRoom);
    put("/rooms/:roomCode", this::vote);
  }

  private Object vote(Request request, Response response) {
    VoteRequest voteRequest = gson.fromJson(request.body(), VoteRequest.class).verify();
    String roomCode = request.params(":roomCode");
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);

    return null;
  }

  private Object joinRoom(Request request, Response response) {
    return null;
  }

  private RoomInfoResponse createRoom(Request request, Response response) {
    CreateGiftHubRoomRequest createRequest =
        gson.fromJson(request.body(), CreateGiftHubRoomRequest.class);
    GiftHubRoom room =
        roomDAO.createRoom(createRequest.getDistributionCents(), createRequest.getRoomName());
    return RoomInfoResponse.from(room);
  }

  private RoomInfoResponse getRoomInfo(Request request, Response response) {
    String roomCode = request.params(":roomCode");
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    return RoomInfoResponse.from(room);
  }
}