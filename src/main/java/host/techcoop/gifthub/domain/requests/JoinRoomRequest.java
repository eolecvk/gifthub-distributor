package host.techcoop.gifthub.domain.requests;

import lombok.Value;

@Value
public class JoinRoomRequest {
  String name;
  String needsDescription;
  boolean participant;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
}
