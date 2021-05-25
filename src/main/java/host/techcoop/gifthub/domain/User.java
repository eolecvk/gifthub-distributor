package host.techcoop.gifthub.domain;

import java.util.List;
import lombok.Value;

@Value
public class User {

  String name;
  String needsDescription;
  List<UserVote> votes;
  int needsUpperBoundCents;
  int needsLowerBoundCents;
}
