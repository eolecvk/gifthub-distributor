package host.techcoop.gifthub;

import com.google.common.collect.ImmutableList;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.domain.exceptions.RoomJoinException;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.stream.Stream;

@Singleton
public class InMemoryGiftHubRoomDAO implements GiftHubRoomDAO {

  private final Map<String, GiftHubRoom> roomsByCode;
  private final Random random = new Random();

  @Inject
  InMemoryGiftHubRoomDAO() {
    roomsByCode = new HashMap<>();
  }

  @Override
  public GiftHubRoom getRoomByCode(String code) {
    return roomsByCode.get(code.toUpperCase());
  }

  @Override
  public GiftHubRoom createRoom(int distributionCents, String name) {
    synchronized (roomsByCode) {
      String code = getUniqueCode();

      GiftHubRoom room =
          GiftHubRoom.builder()
              .roomName(name)
              .code(code)
              .splittingCents(distributionCents)
              .people(ImmutableList.of())
              .build();
      roomsByCode.put(code, room);
      return room;
    }
  }

  @Override
  public int addUserToRoom(String roomCode, JoinRoomRequest request) {
    if (!roomsByCode.containsKey(roomCode)) {
      throw new RoomJoinException();
    }
    GiftHubRoom room = roomsByCode.get(roomCode);
    synchronized (room) {
      int newUserId = room.getPeople().stream().mapToInt(User::getUserId).max().orElse(0) + 1;
      User user = User.fromJoinRoomRequest(request, newUserId);
      GiftHubRoom newRoom = room.withUpdatedUser(user);
      roomsByCode.put(roomCode, newRoom);
      return newUserId;
    }
  }

  @Override
  public User getUserFromRoom(String roomCode, int userId) {
    return roomsByCode.get(roomCode).getPeople().stream()
        .filter(person -> person.getUserId() == userId)
        .findFirst()
        .get();
  }

  @Override
  public GiftHubRoom updateUserInRoom(String roomCode, User user) {
    GiftHubRoom room = roomsByCode.get(roomCode);
    synchronized (room) {
      GiftHubRoom newRoom = room.withUpdatedUser(user);
      roomsByCode.put(roomCode, newRoom);
      return newRoom;
    }
  }

  private String getUniqueCode() {
    String code;

    while (true) {
      code =
          Stream.of(1, 2, 3, 4)
              .map(x -> (char) (random.nextInt(26) + 'a'))
              .map(Character::toUpperCase)
              .map(x -> "" + x)
              .reduce((a, b) -> a + b)
              .get();
      if (!roomsByCode.containsKey(code)) {
        break;
      }
    }
    return code;
  }
}
