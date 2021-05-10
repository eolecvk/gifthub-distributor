package host.techcoop.gifthub.domain.requests;

import host.techcoop.gifthub.domain.UserVote;
import java.util.List;
import lombok.Value;

@Value
public class VoteRequest {
  List<UserVote> votes;

  public VoteRequest verify() {
    double total = votes.stream().mapToDouble(UserVote::getPercentSplit).sum();
    if (Math.abs(total - 1d) > 0.0001) {
      throw new RuntimeException("Failed to verify user votes " + votes);
    }
    return this;
  }
}
