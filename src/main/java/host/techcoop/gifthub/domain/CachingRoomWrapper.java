package host.techcoop.gifthub.domain;

import lombok.Value;

@Value
public class CachingRoomWrapper {
  GiftHubRoom room;
  String jsonBlob;
}
