package host.techcoop.gifthub.domain.requests;

import lombok.Value;

@Value
public class CreateRoomRequest {
  String roomName;
  int splittingCents;
}
