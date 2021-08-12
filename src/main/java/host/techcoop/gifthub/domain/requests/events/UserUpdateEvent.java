package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class UserUpdateEvent implements Event {
  String name;
  String needsDescription;
  Integer needsUpperBoundCents;
  Integer needsLowerBoundCents;

  @Override
  public EventKind getKind() {
    return EventKind.USER_UPDATE;
  }
}
