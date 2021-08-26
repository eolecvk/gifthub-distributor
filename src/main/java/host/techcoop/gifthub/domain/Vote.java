package host.techcoop.gifthub.domain;

import lombok.Value;

@Value
public class Vote {
  int recipientId;
  int voterId;
  int cents;
}
