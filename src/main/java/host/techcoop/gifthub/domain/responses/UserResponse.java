package host.techcoop.gifthub.domain.responses;

import host.techcoop.gifthub.domain.enums.EmotiveKind;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {

  int personId;
  String name;
  String needsDescription;
  List<Long> votesCents;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
  long avgCents;
  Map<EmotiveKind, Collection<Integer>> emotive;
}
