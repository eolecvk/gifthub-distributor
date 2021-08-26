package host.techcoop.gifthub.domain.requests;

import lombok.Value;

@Value
public class VoterJoinRequest {
  String name;
  String path;
}
