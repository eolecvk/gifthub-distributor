package host.techcoop.gifthub.domain;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Voter {
  public static final Voter EMPTY_VOTER =
      Voter.builder()
          .voterId(-1)
          .name("")
          .path("")
          .emotiveStateByRecipientId(ImmutableMap.of())
          .centsByRecipientId(ImmutableMap.of())
          .build();

  int voterId;
  String name;
  String path;
  ImmutableMap<Integer, EmotiveKind> emotiveStateByRecipientId;
  ImmutableMap<Integer, Integer> centsByRecipientId;

  public Voter.VoterBuilder toBuilder() {
    return Voter.builder()
        .voterId(this.voterId)
        .name(this.name)
        .path(this.path)
        .emotiveStateByRecipientId(this.emotiveStateByRecipientId)
        .centsByRecipientId(this.centsByRecipientId);
  }

  public ImmutableList<Vote> getVotes() {
    return centsByRecipientId.entrySet().stream()
        .map(entry -> new Vote(entry.getKey(), this.voterId, entry.getValue()))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<EmotiveState> getEmotiveStates() {
    return emotiveStateByRecipientId.entrySet().stream()
        .map(e -> new EmotiveState(e.getKey(), this.voterId, e.getValue()))
        .collect(ImmutableList.toImmutableList());
  }

  public Voter withUpdatedVote(Vote voteIn) {
    ImmutableMap.Builder<Integer, Integer> mapBuilder = ImmutableMap.builder();
    centsByRecipientId.entrySet().stream()
        .filter(entry -> !entry.getKey().equals(voteIn.getRecipientId()))
        .forEach(mapBuilder::put);
    mapBuilder.put(voteIn.getRecipientId(), voteIn.getCents());
    return this.toBuilder().centsByRecipientId(mapBuilder.build()).build();
  }

  public Voter withUpdatedEmotiveState(EmotiveState state) {
    ImmutableMap.Builder<Integer, EmotiveKind> mapBuilder = ImmutableMap.builder();
    emotiveStateByRecipientId.entrySet().stream()
        .filter(entry -> !entry.getKey().equals(state.getRecipientId()))
        .forEach(mapBuilder::put);
    mapBuilder.put(state.getRecipientId(), state.getKind());
    return this.toBuilder().emotiveStateByRecipientId(mapBuilder.build()).build();
  }

  public Voter withRemovedEmotiveState(int recipientId) {
    ImmutableMap.Builder<Integer, EmotiveKind> mapBuilder = ImmutableMap.builder();
    emotiveStateByRecipientId.entrySet().stream()
        .filter(entry -> entry.getKey().equals(recipientId))
        .forEach(mapBuilder::put);
    return this.toBuilder().emotiveStateByRecipientId(mapBuilder.build()).build();
  }

  public Voter withRemovedVote(int recipientId) {
    ImmutableMap.Builder<Integer, Integer> centsByRecipientIdBuilder = ImmutableMap.builder();
    this.centsByRecipientId.entrySet().stream()
        .filter(entry -> entry.getKey() != recipientId)
        .forEach(centsByRecipientIdBuilder::put);
    return this.toBuilder().centsByRecipientId(centsByRecipientIdBuilder.build()).build();
  }
}
