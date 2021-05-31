package host.techcoop.gifthub.domain.interfaces;

import host.techcoop.gifthub.domain.enums.EventKind;

public interface Event {
  public EventKind getKind();
}
