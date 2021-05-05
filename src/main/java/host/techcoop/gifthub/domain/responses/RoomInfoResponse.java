package host.techcoop.gifthub.domain.responses;

import com.google.common.collect.ImmutableList;
import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.domain.UserVotes;
import java.util.List;
import lombok.Value;

@Value
public class RoomInfoResponse {

  List<UserResponse> users;

  public static RoomInfoResponse from(GiftHubRoom room) {
    ImmutableList<UserResponse> userResponses = room.getUsers()
        .stream()
        .map(User::getName)
        .map(userName -> {
          double averageVote = room.getUsers()
              .stream().flatMapToDouble(
                  user -> user.getVotes()
                      .stream()
                      .filter(vote -> vote.getUserName().equals(userName))
                      .mapToDouble(UserVotes::getPercentSplit)
              ).average().getAsDouble();
          return new UserResponse(userName, averageVote);
        }).collect(ImmutableList.toImmutableList());
    return new RoomInfoResponse(userResponses);
  }
}
