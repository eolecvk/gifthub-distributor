package host.techcoop.gifthub.domain;

import java.util.List;
import lombok.Value;

@Value
public class User {

  String name;
  List<UserVote> votes;
  int needHigherCents;
  int needLowerCents;
}
