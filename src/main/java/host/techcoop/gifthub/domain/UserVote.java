package host.techcoop.gifthub.domain;

import lombok.Value;

@Value
public class UserVote {

  int userId;
  double percentSplit;
}
