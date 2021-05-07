package host.techcoop.gifthub.domain;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GiftHubRoom {

  String code;
  String name;
  List<User> users;
  int distributionCents;
}
