package host.techcoop.gifthub.domain.responses;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {

  int personId;
  String name;
  String needsDescription;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
  double voteTotal;
}
