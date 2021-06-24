package host.techcoop.gifthub.domain.responses;

import com.google.common.collect.ImmutableList;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {

  int personId;
  String name;
  String needsDescription;
  ImmutableList<Long> votesCents;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
  long avgCents;
}
