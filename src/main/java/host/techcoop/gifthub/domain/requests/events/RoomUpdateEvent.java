package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class RoomUpdateEvent implements Event {
  Integer splittingCents;
  String name;

  @Override
  public EventKind getKind() {
    return EventKind.ROOM_UPDATE;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    roomDAO.updateRoomProps(roomCode, name, splittingCents);
  }
}
