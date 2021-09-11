package host.techcoop.gifthub.domain.responses;

import com.google.common.collect.ImmutableMap;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RecipientResponse {
  int recipientId;
  String name;
  String needsDescription;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
  ImmutableMap<Integer, Integer> votesCents;
  int avgCents;
  ImmutableMap<Integer, EmotiveKind> emotive;
}
