package host.techcoop.gifthub.domain;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GiftHubRoom {

  String code;
  String roomName;
  List<User> people;
  int amountSplittingCents;
}
