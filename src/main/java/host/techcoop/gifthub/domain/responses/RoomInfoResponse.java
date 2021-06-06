package host.techcoop.gifthub.domain.responses;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.ImmutableListMultimap.toImmutableListMultimap;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ListMultimap;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.UserVote;
import java.util.Collection;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RoomInfoResponse {

  String roomName;
  String roomCode;
  int splittingCents;
  List<UserResponse> people;

  public static RoomInfoResponse from(GiftHubRoom room) {
    ListMultimap<Integer, UserVote> votesByUserId =
        room.getPeople().stream()
            .flatMap(person -> person.getVotes().stream())
            .collect(toImmutableListMultimap(UserVote::getUserId, x -> x));

    List<UserResponse> userResponses =
        room.getPeople().stream()
            .map(
                user -> {
                  Collection<UserVote> votes = votesByUserId.get(user.getUserId());
                  ImmutableList<Double> anonVotes =
                      votes.stream().map(UserVote::getPercentSplit).collect(toImmutableList());
                  double averageVote =
                      anonVotes.stream().mapToDouble(x -> x).average().orElse(0.0f);
                  return UserResponse.builder()
                      .name(user.getName())
                      .votes(anonVotes)
                      .needsDescription(user.getNeedsDescription())
                      .needsLowerBoundCents(user.getNeedsLowerBoundCents())
                      .needsUpperBoundCents(user.getNeedsUpperBoundCents())
                      .personId(user.getUserId())
                      .voteTotal(averageVote)
                      .build();
                })
            .collect(toImmutableList());

    return RoomInfoResponse.builder()
        .roomCode(room.getCode())
        .roomName(room.getRoomName())
        .splittingCents(room.getSplittingCents())
        .people(userResponses)
        .build();
  }
}
