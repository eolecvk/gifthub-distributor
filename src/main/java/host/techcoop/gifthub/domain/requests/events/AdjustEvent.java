package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Vote;
import host.techcoop.gifthub.domain.Voter;
import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.exceptions.PermissionsException;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class AdjustEvent implements Event {
  int recipientId;
  int newValueCents;

  @Override
  public EventKind getKind() {
    return EventKind.ADJUST;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    if (voterId == -1) {
      throw new PermissionsException();
    }
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    Voter voter =
        room.getVotersById()
            .get(voterId)
            .getVoter()
            .withUpdatedVote(new Vote(recipientId, voterId, newValueCents));
    roomDAO.updateVoterInRoom(roomCode, voter);
  }
}
