package host.techcoop.gifthub.domain;

import host.techcoop.gifthub.domain.enums.EmotiveKind;
import lombok.Value;

@Value
public class EmotiveState {
  int recipientId;
  int voterId;
  EmotiveKind kind;

  public EmotiveState getOpposite() {
    return new EmotiveState(recipientId, voterId, kind.getOpposite());
  }
}
