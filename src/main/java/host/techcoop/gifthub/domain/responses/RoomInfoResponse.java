package host.techcoop.gifthub.domain.responses;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableListMultimap;
import com.google.common.collect.ImmutableMap;
import host.techcoop.gifthub.domain.EmotiveState;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Vote;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RoomInfoResponse {

  String roomName;
  String roomCode;
  int splittingCents;
  ImmutableList<VoterResponse> voters;
  ImmutableList<RecipientResponse> recipients;

  public RoomInfoResponse.RoomInfoResponseBuilder toBuilder() {
    return RoomInfoResponse.builder()
        .roomName(roomName)
        .roomCode(roomCode)
        .splittingCents(splittingCents)
        .voters(voters)
        .recipients(recipients);
  }

  public static RoomInfoResponse from(GiftHubRoom room) {
    ImmutableListMultimap<Integer, Vote> votesByRecipientId =
        room.getVotersById().values().stream()
            .flatMap(voter -> voter.getVotes().stream())
            .collect(ImmutableListMultimap.toImmutableListMultimap(Vote::getRecipientId, x -> x));

    ImmutableListMultimap<Integer, EmotiveState> emotiveStatesByRecipientId =
        room.getVotersById().values().stream()
            .flatMap(voter -> voter.getEmotiveStates().stream())
            .collect(
                ImmutableListMultimap.toImmutableListMultimap(
                    EmotiveState::getRecipientId, x -> x));

    ImmutableList<VoterResponse> voters =
        room.getVotersById().values().stream()
            .map(
                voter ->
                    VoterResponse.builder()
                        .voterId(voter.getVoterId())
                        .name(voter.getName())
                        .build())
            .collect(ImmutableList.toImmutableList());
    ImmutableList<RecipientResponse> recipients =
        room.getRecipientsById().values().stream()
            .map(
                recipient ->
                    RecipientResponse.builder()
                        .recipientId(recipient.getRecipientId())
                        .name(recipient.getName())
                        .needsDescription(recipient.getNeedsDescription())
                        .needsLowerBoundCents(recipient.getNeedsLowerBoundCents())
                        .needsUpperBoundCents(recipient.getNeedsUpperBoundCents())
                        .avgCents(
                            votesByRecipientId.get(recipient.getRecipientId()).stream()
                                    .mapToInt(Vote::getCents)
                                    .sum()
                                / room.getVotersById().size())
                        .votesCents(
                            votesByRecipientId.get(recipient.getRecipientId()).stream()
                                .collect(
                                    ImmutableMap.toImmutableMap(Vote::getVoterId, Vote::getCents)))
                        .emotive(
                            emotiveStatesByRecipientId.get(recipient.getRecipientId()).stream()
                                .collect(
                                    ImmutableMap.toImmutableMap(
                                        EmotiveState::getVoterId, EmotiveState::getKind)))
                        .build())
            .collect(ImmutableList.toImmutableList());

    return RoomInfoResponse.builder()
        .roomName(room.getRoomName())
        .roomCode(room.getCode())
        .splittingCents(room.getSplittingCents())
        .voters(voters)
        .recipients(recipients)
        .build();
  }
}
