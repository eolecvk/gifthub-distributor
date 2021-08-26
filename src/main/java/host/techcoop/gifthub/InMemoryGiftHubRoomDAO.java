package host.techcoop.gifthub;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.Recipient;
import host.techcoop.gifthub.domain.Voter;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

@Singleton
public class InMemoryGiftHubRoomDAO implements GiftHubRoomDAO {

  private final Cache<String, GiftHubRoom> roomsByCode;
  private final WordGenerator wordGenerator;
  private final Random random = new Random();

  @Inject
  InMemoryGiftHubRoomDAO(WordGenerator wordGenerator) {
    this.wordGenerator = wordGenerator;
    roomsByCode = CacheBuilder.newBuilder().expireAfterAccess(6, TimeUnit.HOURS).build();
  }

  @Override
  public GiftHubRoom getRoomByCode(String code) {
    return roomsByCode.getIfPresent(code.toUpperCase());
  }

  @Override
  public GiftHubRoom createRoom(int distributionCents, String name) {
    synchronized (roomsByCode) {
      String code = getUniqueCode();
      GiftHubRoom room =
          GiftHubRoom.EMPTY_ROOM.toBuilder()
              .roomName(name)
              .code(code)
              .splittingCents(distributionCents)
              .build();
      roomsByCode.put(code, room);
      return room;
    }
  }

  @Override
  public Voter addVoterToRoom(String roomCode, String voterName) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      Voter voter =
          Voter.builder()
              .name(voterName)
              .voterId(room.getNextVoterId())
              .path(getUniquePath(room.getVotersById().values().asList()))
              .build();
      GiftHubRoom newRoom =
          room.withUpdatedVoter(voter).toBuilder().nextVoterId(voter.getVoterId() + 1).build();
      roomsByCode.put(roomCode, newRoom);
      return voter;
    }
  }

  @Override
  public Recipient addRecipientToRoom(
      String roomCode,
      String name,
      String needsDescription,
      int needsUpperBoundCents,
      int needsLowerBoundCents) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      Recipient recipient =
          Recipient.builder()
              .name(name)
              .needsDescription(needsDescription)
              .needsUpperBoundCents(needsUpperBoundCents)
              .needsLowerBoundCents(needsLowerBoundCents)
              .recipientId(room.getNextRecipientId())
              .build();
      GiftHubRoom newRoom =
          room.withUpdatedRecipient(recipient).toBuilder()
              .nextRecipientId(recipient.getRecipientId() + 1)
              .build();
      roomsByCode.put(roomCode, newRoom);
      return recipient;
    }
  }

  @Override
  public GiftHubRoom updateVoterInRoom(String roomCode, Voter voter) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      GiftHubRoom newRoom = room.withUpdatedVoter(voter);
      roomsByCode.put(roomCode, newRoom);
      return newRoom;
    }
  }

  @Override
  public GiftHubRoom updateRecipientInRoom(String roomCode, Recipient recipient) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      GiftHubRoom newRoom = room.withUpdatedRecipient(recipient);
      roomsByCode.put(roomCode, newRoom);
      return newRoom;
    }
  }

  @Override
  public void removeRecipientFromRoom(String roomCode, int recipientId) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      GiftHubRoom newRoom = room.withRemovedRecipient(recipientId);
      roomsByCode.put(roomCode, newRoom);
    }
  }

  @Override
  public void removeVoterFromRoom(String roomCode, int voterId) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      GiftHubRoom newRoom = room.withRemovedVoter(voterId);
      roomsByCode.put(roomCode, newRoom);
    }
  }

  @Override
  public GiftHubRoom updateRoomProps(String roomCode, String name, Integer splittingCents) {
    roomCode = roomCode.toUpperCase().intern();
    synchronized (roomCode) {
      GiftHubRoom room = roomsByCode.getIfPresent(roomCode);
      GiftHubRoom.GiftHubRoomBuilder roomBuilder = room.toBuilder();
      if (name != null) {
        roomBuilder.roomName(name);
      }
      if (splittingCents != null) {
        roomBuilder.splittingCents(splittingCents);
      }
      GiftHubRoom newRoom = roomBuilder.build();
      roomsByCode.put(roomCode, newRoom);
      return newRoom;
    }
  }

  private String getUniquePath(ImmutableList<Voter> voters) {
    Set<String> existingPaths =
        voters.stream().map(Voter::getPath).collect(ImmutableSet.toImmutableSet());
    String path;
    while (true) {
      path = wordGenerator.getWords(3, "-");
      if (!existingPaths.contains(path)) {
        return path;
      }
    }
  }

  private String getUniqueCode() {
    String code;

    while (true) {
      code =
          Stream.of(1, 2, 3, 4)
              .map(x -> (char) (random.nextInt(26) + 'a'))
              .map(Character::toUpperCase)
              .map(x -> "" + x)
              .reduce((a, b) -> a + b)
              .get();
      if (roomsByCode.getIfPresent(code) == null) {
        break;
      }
    }
    return code.intern();
  }
}
