package host.techcoop.gifthub.interfaces;

import host.techcoop.gifthub.domain.User;

public interface UserDAO {

  public User createUserByName(String name);

  public User getUserByNameAndRoom(String name, String room);

  public User getUserByCookie(String cookie);
}
