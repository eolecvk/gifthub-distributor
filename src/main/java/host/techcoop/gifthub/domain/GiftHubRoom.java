package host.techcoop.gifthub.domain;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GiftHubRoom {
  public static final GiftHubRoom EMPTY_ROOM =
      GiftHubRoom.builder()
          .code("")
          .roomName("")
          .votersById(ImmutableMap.of())
          .recipientsById(ImmutableMap.of())
          .splittingCents(0)
          .nextRecipientId(1)
          .nextVoterId(9001)
          .build();
  String code;
  String roomName;
  ImmutableMap<Integer, VoterHistory> votersById;
  ImmutableMap<Integer, Recipient> recipientsById;
  int splittingCents;
  int nextRecipientId;
  int nextVoterId;

  public GiftHubRoom.GiftHubRoomBuilder toBuilder() {
    return GiftHubRoom.builder()
        .code(this.code)
        .roomName(this.roomName)
        .votersById(this.votersById)
        .recipientsById(this.recipientsById)
        .splittingCents(this.splittingCents)
        .nextRecipientId(this.nextRecipientId)
        .nextVoterId(this.nextVoterId);
  }

  public ImmutableList<Voter> getVoters() {
    return votersById.values().stream()
        .map(VoterHistory::getVoter)
        .collect(ImmutableList.toImmutableList());
  }

  public GiftHubRoom withUpdatedVoter(Voter voter) {
    int voterId = voter.getVoterId();
    ImmutableMap.Builder<Integer, VoterHistory> voterBuilder = ImmutableMap.builder();
    votersById.entrySet().stream().filter(v -> v.getKey() != voterId).forEach(voterBuilder::put);
    if (votersById.containsKey(voterId)) {
      voterBuilder.put(voterId, votersById.get(voterId).withNewEvent(voter));
    } else {
      voterBuilder.put(voterId, VoterHistory.of(voter));
    }
    return this.toBuilder().votersById(voterBuilder.build()).build();
  }

  public GiftHubRoom withUpdatedRecipient(Recipient recipient) {
    ImmutableMap.Builder<Integer, Recipient> recipientBuilder = ImmutableMap.builder();
    recipientsById.entrySet().stream()
        .filter(r -> r.getKey() != recipient.getRecipientId())
        .forEach(recipientBuilder::put);
    recipientBuilder.put(recipient.getRecipientId(), recipient);
    return this.toBuilder().recipientsById(recipientBuilder.build()).build();
  }

  public GiftHubRoom withRemovedVoter(int voterId) {
    ImmutableMap.Builder<Integer, VoterHistory> voterBuilder = ImmutableMap.builder();
    votersById.entrySet().stream().filter(v -> v.getKey() != voterId).forEach(voterBuilder::put);
    return this.toBuilder().votersById(voterBuilder.build()).build();
  }

  public GiftHubRoom withRemovedRecipient(int recipientId) {
    ImmutableMap.Builder<Integer, Recipient> recipientBuilder = ImmutableMap.builder();
    ImmutableMap.Builder<Integer, VoterHistory> voterBuilder = ImmutableMap.builder();
    recipientsById.entrySet().stream()
        .filter(r -> r.getKey() != recipientId)
        .forEach(recipientBuilder::put);
    votersById.entrySet().stream()
        .forEach(
            entry -> {
              voterBuilder.put(entry.getKey(), entry.getValue().withRemovedRecipient(recipientId));
            });
    return this.toBuilder()
        .recipientsById(recipientBuilder.build())
        .votersById(voterBuilder.build())
        .build();
  }

  public GiftHubRoom withRedo(int voterId) {
    ImmutableMap.Builder<Integer, VoterHistory> voterBuilder = ImmutableMap.builder();
    votersById
        .values()
        .forEach(
            voterHistory -> {
              if (voterHistory.getVoter().getVoterId() == voterId) {
                voterBuilder.put(voterHistory.getVoter().getVoterId(), voterHistory.redone());
              } else {
                voterBuilder.put(voterHistory.getVoter().getVoterId(), voterHistory);
              }
            });
    return this.toBuilder().votersById(voterBuilder.build()).build();
  }

  public GiftHubRoom withUndo(int voterId) {
    ImmutableMap.Builder<Integer, VoterHistory> voterBuilder = ImmutableMap.builder();
    votersById
        .values()
        .forEach(
            voterHistory -> {
              if (voterHistory.getVoter().getVoterId() == voterId) {
                voterBuilder.put(voterHistory.getVoter().getVoterId(), voterHistory.undone());
              } else {
                voterBuilder.put(voterHistory.getVoter().getVoterId(), voterHistory);
              }
            });
    return this.toBuilder().votersById(voterBuilder.build()).build();
  }
}
