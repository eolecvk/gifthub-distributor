package host.techcoop.gifthub.domain.interfaces;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;

public interface Event {
  public EventKind getKind();

  public void apply(GiftHubRoomDAO roomDAO, String roomCode, int voterId);
}
