package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class RecipientRemoveEvent implements Event {
  int recipientId;

  @Override
  public EventKind getKind() {
    return EventKind.RECIPIENT_REMOVE;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    roomDAO.removeRecipientFromRoom(roomCode, recipientId);
  }
}
