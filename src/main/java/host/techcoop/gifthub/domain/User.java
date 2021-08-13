package host.techcoop.gifthub.domain;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSetMultimap;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
import host.techcoop.gifthub.domain.exceptions.VerificationException;
import host.techcoop.gifthub.domain.requests.JoinRoomRequest;
import java.util.Map.Entry;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class User {
  public static final User EMPTY_USER = User.builder().userId(-1).path("").build();

  int userId;
  String name;
  String needsDescription;
  ImmutableMap<Integer, Long> centsByUserId;
  ImmutableSetMultimap<Integer, EmotiveKind> emotiveStateByUserId;
  String path;
  int needsUpperBoundCents;
  int needsLowerBoundCents;

  public ImmutableList<UserVote> getVotes() {
    return centsByUserId.entrySet().stream()
        .map(entry -> new UserVote(entry.getKey(), entry.getValue()))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<EmotiveState> getEmotiveStates() {
    return emotiveStateByUserId.entries().stream()
        .map(e -> new EmotiveState(e.getKey(), this.userId, e.getValue()))
        .collect(ImmutableList.toImmutableList());
  }

  public static User fromJoinRoomRequest(JoinRoomRequest request, int userId, String path) {
    return User.builder()
        .userId(userId)
        .name(request.getName())
        .needsDescription(request.getNeedsDescription())
        .path(path)
        .centsByUserId(ImmutableMap.of())
        .emotiveStateByUserId(ImmutableSetMultimap.of())
        .needsLowerBoundCents(request.getNeedsLowerBoundCents())
        .needsUpperBoundCents(request.getNeedsUpperBoundCents())
        .build();
  }

  public User.UserBuilder toBuilder() {
    return User.builder()
        .userId(this.userId)
        .name(this.name)
        .needsDescription(this.needsDescription)
        .centsByUserId(this.centsByUserId)
        .emotiveStateByUserId(this.emotiveStateByUserId)
        .needsLowerBoundCents(this.needsLowerBoundCents)
        .needsUpperBoundCents(this.needsUpperBoundCents);
  }

  public User withUpdatedUserVote(UserVote voteIn) {
    ImmutableMap.Builder<Integer, Long> mapBuilder = ImmutableMap.builder();
    centsByUserId.entrySet().stream()
        .filter(entry -> !entry.getKey().equals(voteIn.getUserId()))
        .forEach(entry -> mapBuilder.put(entry.getKey(), entry.getValue()));
    mapBuilder.put(voteIn.getUserId(), voteIn.getCents());
    return this.toBuilder().centsByUserId(mapBuilder.build()).build();
  }

  public User withUpdatedEmotiveState(EmotiveState state) {
    ImmutableSetMultimap.Builder<Integer, EmotiveKind> mapBuilder = ImmutableSetMultimap.builder();
    mapBuilder.putAll(emotiveStateByUserId).put(state.getUserId(), state.getKind());
    return this.toBuilder().emotiveStateByUserId(mapBuilder.build()).build();
  }

  public User withRemovedEmotiveState(EmotiveState state) {
    ImmutableSetMultimap.Builder<Integer, EmotiveKind> mapBuilder = ImmutableSetMultimap.builder();
    mapBuilder.putAll(
        emotiveStateByUserId.entries().stream()
            .filter(
                e -> !e.getKey().equals(state.getUserId()) || !e.getValue().equals(state.getKind()))
            .collect(ImmutableList.toImmutableList()));
    return this.toBuilder().emotiveStateByUserId(mapBuilder.build()).build();
  }

  public User verify(User oldState, GiftHubRoom room) {
    if (centsByUserId.entrySet().stream().mapToLong(Entry::getValue).sum()
        > room.getSplittingCents()) {
      throw new VerificationException("Votes add up to more than room total", oldState.getVotes());
    }
    return this;
  }
}
