package host.techcoop.gifthub.domain;

import com.google.common.collect.ImmutableList;
import host.techcoop.gifthub.domain.exceptions.VerificationException;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class User {
  int userId;
  String name;
  String needsDescription;
  ImmutableList<UserVote> votes;
  int needsUpperBoundCents;
  int needsLowerBoundCents;

  public static User fromJoinRoomRequest(JoinRoomRequest request, int userId) {
    return new User(
        userId,
        request.getName(),
        request.getNeedsDescription(),
        ImmutableList.of(),
        request.getNeedsUpperBoundCents(),
        request.getNeedsLowerBoundCents());
  }

  public User.UserBuilder toBuilder() {
    return User.builder()
        .userId(this.userId)
        .name(this.name)
        .needsDescription(this.needsDescription)
        .votes(this.votes)
        .needsLowerBoundCents(this.needsLowerBoundCents)
        .needsUpperBoundCents(this.needsUpperBoundCents);
  }

  public User withUpdatedUserVote(UserVote voteIn) {
    ImmutableList.Builder<UserVote> voteBuilder = ImmutableList.builder();
    votes.stream().filter(vote -> vote.getUserId() != voteIn.getUserId()).forEach(voteBuilder::add);
    voteBuilder.add(voteIn);
    return this.toBuilder().votes(voteBuilder.build()).build();
  }

  public User verify(User oldState, GiftHubRoom room) {
    if (votes.stream().mapToLong(UserVote::getCents).sum() > room.getSplittingCents()) {
      throw new VerificationException("Votes add up to more than room total", oldState.getVotes());
    }
    return this;
  }
}
