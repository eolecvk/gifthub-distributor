package host.techcoop.gifthub.domain;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Recipient {
  int recipientId;
  String name;
  String needsDescription;
  int needsUpperBoundCents;
  int needsLowerBoundCents;

  public Recipient.RecipientBuilder toBuilder() {
    return Recipient.builder()
        .recipientId(this.recipientId)
        .name(this.name)
        .needsDescription(this.needsDescription)
        .needsLowerBoundCents(this.needsLowerBoundCents)
        .needsUpperBoundCents(this.needsUpperBoundCents);
  }
}
