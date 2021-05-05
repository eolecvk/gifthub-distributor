package host.techcoop.gifthub.domain;

import lombok.Builder;
import lombok.Value;
import java.util.List;

@Value
@Builder
public class GiftHubRoom {

  String code;
  String name;
  List<User> users;
  int distributionCents;
}
