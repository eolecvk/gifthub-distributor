package host.techcoop.gifthub;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.stream.Stream;

@Singleton
public class InMemoryGiftHubRoomDAO implements GiftHubRoomDAO {

  private final Map<String, GiftHubRoom> roomsByCode;
  private final Random random = new Random();

  @Inject
  InMemoryGiftHubRoomDAO() {
    roomsByCode = new HashMap<>();
  }

  @Override
  public GiftHubRoom getRoomByCode(String code) {
    return roomsByCode.get(code.toUpperCase());
  }

  @Override
  public GiftHubRoom createRoom(int distributionCents, String name) {
    String code;
    while (true) {
      code =
          Stream.of(1, 2, 3, 4)
              .map(x -> (char) (random.nextInt(26) + 'a'))
              .map(Character::toUpperCase)
              .map(x -> "" + x)
              .reduce((a, b) -> a + b)
              .get();
      if (!roomsByCode.containsKey(code)) {
        break;
      }
    }
    GiftHubRoom room =
        GiftHubRoom.builder()
            .name(name)
            .code(code)
            .distributionCents(distributionCents)
            .users(new ArrayList<>())
            .build();
    roomsByCode.put(code, room);
    return room;
  }
}
