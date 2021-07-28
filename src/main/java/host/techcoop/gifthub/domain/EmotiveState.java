package host.techcoop.gifthub.domain;

import host.techcoop.gifthub.domain.enums.EmotiveKind;
import lombok.Value;

@Value
public class EmotiveState {
  int userId;
  int emoterId;
  EmotiveKind kind;

  public EmotiveState getOpposite() {
    return new EmotiveState(userId, emoterId, kind.getOpposite());
  }
}
