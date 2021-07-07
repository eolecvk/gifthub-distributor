package host.techcoop.gifthub.domain.requests.events;

import host.techcoop.gifthub.domain.enums.EventKind;
import host.techcoop.gifthub.domain.interfaces.Event;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class EmotiveEvent implements Event {
  int barId;
  EmotiveKind emotion;
  Toggle toggle;

  @Override
  public EventKind getKind() {
    return EventKind.EMOTIVE;
  }
}
