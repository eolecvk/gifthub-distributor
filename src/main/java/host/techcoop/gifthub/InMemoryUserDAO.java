package host.techcoop.gifthub;

import host.techcoop.gifthub.domain.User;
import host.techcoop.gifthub.interfaces.UserDAO;

public class InMemoryUserDAO implements UserDAO {

  @Override
  public User createUserByName(String name) {
    return null;
  }

  @Override
  public User getUserByNameAndRoom(String name, String room) {
    return null;
  }

  @Override
  public User getUserByCookie(String cookie) {
    return null;
  }
}
