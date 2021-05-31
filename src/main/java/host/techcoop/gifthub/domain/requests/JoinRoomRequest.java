package host.techcoop.gifthub.domain.requests;

import lombok.Value;

@Value
public class JoinRoomRequest {
  String name;
  String needsDescription;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
}
