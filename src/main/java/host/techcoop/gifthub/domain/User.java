package host.techcoop.gifthub.domain;

import lombok.Value;
import java.util.List;

@Value
public class User {

  String name;
  List<UserVotes> votes;
  int needHigherCents;
  int needLowerCents;
}
