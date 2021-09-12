package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;

public class RedoEvent implements Event {

  @Override
  public EventKind getKind() {
    return EventKind.REDO;
  }

  @Override
  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId) {
    roomDAO.redo(roomCode, voterId);
  }
}
