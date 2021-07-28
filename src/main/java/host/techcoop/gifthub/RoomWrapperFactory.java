package host.techcoop.gifthub;

import com.google.gson.Gson;
import com.google.inject.Inject;
import host.techcoop.gifthub.domain.CachingRoomWrapper;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.responses.RoomInfoResponse;

public class RoomWrapperFactory {
  private final Gson gson;

  @Inject
  RoomWrapperFactory(Gson gson) {
    this.gson = gson;
  }

  public CachingRoomWrapper getWrapper(GiftHubRoom room) {
    return new CachingRoomWrapper(room, gson.toJson(RoomInfoResponse.from(room)));
  }
}
