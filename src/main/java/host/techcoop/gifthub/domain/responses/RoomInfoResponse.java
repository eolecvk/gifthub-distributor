package host.techcoop.gifthub.domain.responses;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.ImmutableListMultimap.toImmutableListMultimap;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableListMultimap;
import com.google.common.collect.ListMultimap;
import host.techcoop.gifthub.domain.EmotiveState;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.UserVote;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
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

    ListMultimap<Integer, EmotiveState> emotiveStatesByUserId =
        room.getPeople().stream()
            .flatMap(person -> person.getEmotiveStates().stream())
            .collect(toImmutableListMultimap(EmotiveState::getUserId, x -> x));

    List<UserResponse> userResponses =
        room.getPeople().stream()
            .map(
                user -> {
                  Collection<UserVote> votes = votesByUserId.get(user.getUserId());
                  Collection<EmotiveState> emotiveStates =
                      emotiveStatesByUserId.get(user.getUserId());

                  ListMultimap<EmotiveKind, Integer> usersByEmotiveKind =
                      emotiveStates.stream()
                          .collect(
                              ImmutableListMultimap.toImmutableListMultimap(
                                  EmotiveState::getKind, (e) -> user.getUserId()));

                  ImmutableList<Long> anonVotes =
                      votes.stream().map(UserVote::getCents).collect(toImmutableList());
                  long averageVote =
                      anonVotes.stream().mapToLong(x -> x).sum() / room.getPeople().size();
                  return UserResponse.builder()
                      .name(user.getName())
                      .votesCents(anonVotes)
                      .needsDescription(user.getNeedsDescription())
                      .needsLowerBoundCents(user.getNeedsLowerBoundCents())
                      .needsUpperBoundCents(user.getNeedsUpperBoundCents())
                      .personId(user.getUserId())
                      .avgCents(averageVote)
                      .emotive(usersByEmotiveKind.asMap())
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
