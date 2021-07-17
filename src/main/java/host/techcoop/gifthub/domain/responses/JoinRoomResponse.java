package host.techcoop.gifthub.domain.responses;

import lombok.Value;

@Value
public class JoinRoomResponse {
  int userId;
  RoomInfoResponse roomInfo;
}
