package host.techcoop.gifthub.domain.responses;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableListMultimap;
import com.google.common.collect.ImmutableMap;
import host.techcoop.gifthub.domain.EmotiveState;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Vote;
import host.techcoop.gifthub.domain.enums.EmotiveKind;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;
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
                            calculateAvgCents(votesByRecipientId, room, recipient.getRecipientId()))
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

  private static int calculateAvgCents(
      ImmutableListMultimap<Integer, Vote> votesByRecipientId, GiftHubRoom room, int recipientId) {
    if (room.getVotersById().size() == 0) {
      return 0;
    }
    return votesByRecipientId.get(recipientId).stream().mapToInt(Vote::getCents).sum()
        / room.getVotersById().size();
  }

  public static RoomInfoResponse buildTestInfo(GiftHubRoom room) {
    return RoomInfoResponse.builder()
        .roomName(room.getRoomName())
        .roomCode(room.getCode())
        .splittingCents(room.getSplittingCents())
        .voters(buildTestVoters())
        .recipients(buildTestRecipients())
        .build();
  }

  private static ImmutableList<VoterResponse> buildTestVoters() {
    AtomicInteger voterId = new AtomicInteger(9001);
    return Stream.of("David", "Eole", "Bob", "Tosh", "Allie", "Zak", "Oliver")
        .map(name -> VoterResponse.builder().name(name).voterId(voterId.getAndIncrement()).build())
        .collect(ImmutableList.toImmutableList());
  }

  private static ImmutableList<RecipientResponse> buildTestRecipients() {
    return ImmutableList.of(
        RecipientResponse.builder()
            .recipientId(1)
            .name("David")
            .needsLowerBoundCents(500)
            .needsUpperBoundCents(1000)
            .needsDescription("David Needs")
            .emotive(ImmutableMap.of(9001, EmotiveKind.DISSENT_UP))
            .avgCents(6097)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 8518)
                    .put(9002, 7930)
                    .put(9003, 6690)
                    .put(9004, 6734)
                    .put(9005, 4936)
                    .put(9006, 6346)
                    .put(9007, 1526)
                    .build())
            .build(),
        RecipientResponse.builder()
            .recipientId(2)
            .name("Eole")
            .needsLowerBoundCents(1500)
            .needsUpperBoundCents(1800)
            .needsDescription("Eole Needs")
            .emotive(
                ImmutableMap.of(
                    9003,
                    EmotiveKind.DISSENT_DOWN,
                    9004,
                    EmotiveKind.DISSENT_DOWN,
                    9005,
                    EmotiveKind.DISSENT_UP))
            .avgCents(4469)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 1410)
                    .put(9002, 3566)
                    .put(9003, 7880)
                    .put(9004, 3612)
                    .put(9005, 7782)
                    .put(9006, 4305)
                    .put(9007, 2728)
                    .build())
            .build(),
        RecipientResponse.builder()
            .recipientId(3)
            .name("Bob")
            .needsLowerBoundCents(500)
            .needsUpperBoundCents(1300)
            .needsDescription("Bob Needs")
            .emotive(ImmutableMap.of(9007, EmotiveKind.DISSENT_UP, 9002, EmotiveKind.DISSENT_DOWN))
            .avgCents(4950)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 8393)
                    .put(9002, 1482)
                    .put(9003, 1166)
                    .put(9004, 9477)
                    .put(9005, 9038)
                    .put(9006, 362)
                    .put(9007, 4735)
                    .build())
            .build(),
        RecipientResponse.builder()
            .recipientId(4)
            .name("Tosh")
            .needsLowerBoundCents(5000)
            .needsUpperBoundCents(5700)
            .needsDescription("Tosh Needs")
            .emotive(ImmutableMap.of(9001, EmotiveKind.DISSENT_DOWN))
            .avgCents(5893)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 9272)
                    .put(9002, 7738)
                    .put(9003, 2661)
                    .put(9004, 8132)
                    .put(9005, 1080)
                    .put(9006, 9029)
                    .put(9007, 3339)
                    .build())
            .build(),
        RecipientResponse.builder()
            .recipientId(5)
            .name("Allie")
            .needsLowerBoundCents(500)
            .needsUpperBoundCents(800)
            .needsDescription("Allie Needs")
            .emotive(ImmutableMap.of(9002, EmotiveKind.DISSENT_UP, 9003, EmotiveKind.DISSENT_UP))
            .avgCents(5970)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 5056)
                    .put(9002, 94)
                    .put(9003, 8694)
                    .put(9004, 5952)
                    .put(9005, 8551)
                    .put(9006, 4173)
                    .put(9007, 9270)
                    .build())
            .build(),
        RecipientResponse.builder()
            .recipientId(6)
            .name("Zak")
            .needsLowerBoundCents(2500)
            .needsUpperBoundCents(3000)
            .needsDescription("Zak Needs")
            .emotive(ImmutableMap.of())
            .avgCents(4723)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 3646)
                    .put(9002, 2292)
                    .put(9003, 9223)
                    .put(9004, 7686)
                    .put(9005, 2995)
                    .put(9006, 4168)
                    .put(9007, 3056)
                    .build())
            .build(),
        RecipientResponse.builder()
            .recipientId(7)
            .name("Oliver")
            .needsLowerBoundCents(500)
            .needsUpperBoundCents(2000)
            .needsDescription("Oliver Needs")
            .emotive(
                ImmutableMap.of(9002, EmotiveKind.DISSENT_DOWN, 9003, EmotiveKind.DISSENT_DOWN))
            .avgCents(4884)
            .votesCents(
                ImmutableMap.<Integer, Integer>builder()
                    .put(9001, 2790)
                    .put(9002, 7028)
                    .put(9003, 3971)
                    .put(9004, 5579)
                    .put(9005, 385)
                    .put(9006, 5283)
                    .put(9007, 9155)
                    .build())
            .build());
  }
}
