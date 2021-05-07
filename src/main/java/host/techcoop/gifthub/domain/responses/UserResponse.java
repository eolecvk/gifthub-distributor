package host.techcoop.gifthub.domain.responses;

import lombok.Value;

@Value
public class UserResponse {

  String name;
  double voteTotal;
}
