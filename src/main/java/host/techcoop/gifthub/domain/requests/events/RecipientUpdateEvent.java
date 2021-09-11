package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Recipient;
import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class RecipientUpdateEvent implements Event {
  int recipientId;
  String name;
  String needsDescription;
  Integer needsUpperBoundCents;
  Integer needsLowerBoundCents;

  @Override
  public EventKind getKind() {
    return EventKind.RECIPIENT_UPDATE;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    GiftHubRoom room = roomDAO.getRoomByCode(roomCode);
    Recipient.RecipientBuilder recipientBuilder =
        room.getRecipientsById().get(recipientId).toBuilder();
    if (name != null) {
      recipientBuilder.name(name);
    }
    if (needsDescription != null) {
      recipientBuilder.needsDescription(needsDescription);
    }
    if (needsUpperBoundCents != null) {
      recipientBuilder.needsUpperBoundCents(needsUpperBoundCents);
    }
    if (needsLowerBoundCents != null) {
      recipientBuilder.needsLowerBoundCents(needsLowerBoundCents);
    }
    roomDAO.updateRecipientInRoom(roomCode, recipientBuilder.build());
  }
}
