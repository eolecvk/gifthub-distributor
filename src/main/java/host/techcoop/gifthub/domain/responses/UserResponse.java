package host.techcoop.gifthub.domain.responses;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
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
  ImmutableMap<EmotiveKind, ImmutableList<Integer>> emotive;
}
