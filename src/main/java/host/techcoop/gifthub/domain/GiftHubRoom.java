package host.techcoop.gifthub.domain;

import com.google.common.collect.ImmutableList;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GiftHubRoom {
  String code;
  String roomName;
  ImmutableList<User> people;
  int splittingCents;

  public GiftHubRoom.GiftHubRoomBuilder toBuilder() {
    return GiftHubRoom.builder()
        .code(this.code)
        .roomName(this.roomName)
        .people(this.people)
        .splittingCents(this.splittingCents);
  }

  public GiftHubRoom withUpdatedUser(User user) {
    ImmutableList.Builder<User> peopleBuilder = ImmutableList.builder();
    people.stream()
        .filter(person -> person.getUserId() != user.getUserId())
        .forEach(peopleBuilder::add);
    peopleBuilder.add(user);
    return this.toBuilder().people(peopleBuilder.build()).build();
  }
}
