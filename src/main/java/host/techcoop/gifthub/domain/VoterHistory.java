package host.techcoop.gifthub.domain;

import com.google.common.collect.ImmutableList;
import lombok.Value;

@Value
public class VoterHistory {
  ImmutableList<Voter> voterHistory;
  int currentIndex;

  public Voter getVoter() {
    return voterHistory.get(currentIndex);
  }

  private ImmutableList<Voter> truncatedVoters() {
    return voterHistory.subList(Math.max(currentIndex - 100, 0), currentIndex + 1);
  }

  public VoterHistory undone() {
    if (currentIndex == 0) {
      throw new RuntimeException("Cannot Undo");
    }
    return new VoterHistory(voterHistory, currentIndex - 1);
  }

  public VoterHistory redone() {
    if (currentIndex == voterHistory.size() - 1) {
      throw new RuntimeException("Cannot Redo");
    }
    return new VoterHistory(voterHistory, currentIndex + 1);
  }

  public VoterHistory withNewEvent(Voter newVoter) {
    ImmutableList<Voter> newHistory =
        ImmutableList.<Voter>builder().addAll(truncatedVoters()).add(newVoter).build();
    return new VoterHistory(newHistory, newHistory.size() - 1);
  }

  public VoterHistory withRemovedRecipient(int recipientId) {
    return new VoterHistory(
        voterHistory.stream()
            .map(voter -> voter.withRemovedVote(recipientId).withRemovedEmotiveState(recipientId))
            .collect(ImmutableList.toImmutableList()),
        currentIndex);
  }

  public static VoterHistory of(Voter voter) {
    return new VoterHistory(ImmutableList.of(voter), 0);
  }
}
