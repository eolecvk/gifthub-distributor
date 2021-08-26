package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class VoterRemoveEvent implements Event {
  int voterId;

  @Override
  public EventKind getKind() {
    return EventKind.VOTER_REMOVE;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    roomDAO.removeVoterFromRoom(roomCode, this.voterId);
  }
}
