package host.techcoop.gifthub.domain.requests;

import host.techcoop.gifthub.domain.interfaces.Event;
import java.util.List;
import lombok.Value;

@Value
public class UpdateRequest {
  List<Event> events;
}
