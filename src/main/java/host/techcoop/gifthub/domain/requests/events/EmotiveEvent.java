package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.EmotiveState;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Voter;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.enums.Toggle;
import host.techcoop.gifthub.domain.exceptions.PermissionsException;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class EmotiveEvent implements Event {
  int recipientId;
  EmotiveKind emotion;
  Toggle toggle;

  @Override
  public EventKind getKind() {
    return EventKind.EMOTIVE;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    if (voterId == -1) {
      throw new PermissionsException();
    }
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    Voter voter = room.getVotersById().get(voterId).getVoter();
    switch (toggle) {
      case OFF:
        voter = voter.withRemovedEmotiveState(recipientId);
        break;
      case ON:
        voter = voter.withUpdatedEmotiveState(new EmotiveState(recipientId, voterId, emotion));
        break;
    }
    roomDAO.updateVoterInRoom(roomCode, voter);
  }
}
