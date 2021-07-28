package host.techcoop.gifthub.domain.enums;

public enum EmotiveKind {
  DISSENT_DOWN {
    @Override
    public EmotiveKind getOpposite() {
      return DISSENT_UP;
    }
  },
  DISSENT_UP {
    @Override
    public EmotiveKind getOpposite() {
      return DISSENT_DOWN;
    }
  };

  public abstract EmotiveKind getOpposite();
}
