package host.techcoop.gifthub.interfaces;

import host.techcoop.gifthub.domain.GiftHubRoom;

public interface GiftHubRoomDAO {

  GiftHubRoom getRoomByCode(String code);

  GiftHubRoom createRoom(int distributionCents, String name);
}
