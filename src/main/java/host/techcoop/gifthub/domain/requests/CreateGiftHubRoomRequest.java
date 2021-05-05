package host.techcoop.gifthub.domain.requests;

import lombok.Value;

@Value
public class CreateGiftHubRoomRequest {

  String roomName;
  int distributionCents;
}
