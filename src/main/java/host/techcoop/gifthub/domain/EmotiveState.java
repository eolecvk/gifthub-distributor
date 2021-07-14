package host.techcoop.gifthub.domain;

import host.techcoop.gifthub.domain.enums.EmotiveKind;
import lombok.Value;

@Value
public class EmotiveState {
  int userId;
  EmotiveKind kind;
}
