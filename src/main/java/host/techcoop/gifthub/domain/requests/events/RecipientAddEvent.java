package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class RecipientAddEvent implements Event {
  String name;
  String needsDescription;
  Integer needsLowerBoundCents;
  Integer needsUpperBoundCents;

  @Override
  public EventKind getKind() {
    return EventKind.RECIPIENT_ADD;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    roomDAO.addRecipientToRoom(
        roomCode, name, needsDescription, needsUpperBoundCents, needsLowerBoundCents);
  }
}
