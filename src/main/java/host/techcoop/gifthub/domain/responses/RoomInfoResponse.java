package host.techcoop.gifthub.domain.responses;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.ImmutableListMultimap.toImmutableListMultimap;
import static java.util.stream.Collectors.toMap;

import com.google.common.collect.ListMultimap;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.domain.UserVote;
import java.util.Collection;
import java.util.List;
import java.util.Map;
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
    Map<Integer, User> usersById =
        room.getPeople().stream().collect(toMap(User::getUserId, x -> x));
    ListMultimap<Integer, UserVote> votesByUserId =
        room.getPeople().stream()
            .flatMap(person -> person.getVotes().stream())
            .collect(toImmutableListMultimap(UserVote::getUserId, x -> x));

    List<UserResponse> userResponses =
        votesByUserId.asMap().entrySet().stream()
            .map(
                (entry) -> {
                  int userId = entry.getKey();
                  Collection<UserVote> votes = entry.getValue();
                  User user = usersById.get(userId);
                  double averageVote =
                      votes.stream().mapToDouble(UserVote::getPercentSplit).average().orElse(0.0f);
                  return UserResponse.builder()
                      .name(user.getName())
                      .needsDescription(user.getNeedsDescription())
                      .needsLowerBoundCents(user.getNeedsLowerBoundCents())
                      .needsUpperBoundCents(user.getNeedsUpperBoundCents())
                      .personId(userId)
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
