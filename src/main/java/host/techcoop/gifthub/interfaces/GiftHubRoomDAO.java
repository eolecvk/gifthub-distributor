package host.techcoop.gifthub.interfaces;

import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;

public interface GiftHubRoomDAO {

  GiftHubRoom getRoomByCode(String code);

  GiftHubRoom createRoom(int distributionCents, String name);

  int addUserToRoom(String roomCode, JoinRoomRequest user);

  User getUserFromRoom(String roomCode, int userId);

  GiftHubRoom updateUserInRoom(String roomCode, User user);
}
