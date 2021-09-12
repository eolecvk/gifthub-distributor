package host.techcoop.gifthub.interfaces;

import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Recipient;
import host.techcoop.gifthub.domain.Voter;

public interface GiftHubRoomDAO {

  GiftHubRoom getRoomByCode(String code);

  GiftHubRoom createRoom(int distributionCents, String name);

  Voter addVoterToRoom(String roomCode, String voterName);

  Recipient addRecipientToRoom(
      String roomCode,
      String name,
      String needsDescription,
      int needsUpperBoundCents,
      int needsLowerBoundCents);

  GiftHubRoom updateVoterInRoom(String roomCode, Voter voter);

  GiftHubRoom undo(String roomCode, int voterId);

  GiftHubRoom redo(String roomCode, int voterId);

  GiftHubRoom updateRecipientInRoom(String roomCode, Recipient recipient);

  void removeRecipientFromRoom(String roomCode, int recipientId);

  void removeVoterFromRoom(String roomCode, int voterId);

  GiftHubRoom updateRoomProps(String roomCode, String name, Integer splittingCents);
}
