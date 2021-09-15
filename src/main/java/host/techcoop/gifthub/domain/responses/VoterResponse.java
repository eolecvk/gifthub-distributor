package host.techcoop.gifthub.domain.responses;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class VoterResponse {
  int voterId;
  String name;
  int distributedCents;
}
