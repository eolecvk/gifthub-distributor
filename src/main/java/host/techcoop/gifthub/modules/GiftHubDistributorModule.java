package host.techcoop.gifthub.modules;

import com.google.gson.Gson;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import host.techcoop.gifthub.GiftHubWebserver;
import host.techcoop.gifthub.InMemoryGiftHubRoomDAO;
import host.techcoop.gifthub.InMemoryUserDAO;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import host.techcoop.gifthub.interfaces.UserDAO;

public class GiftHubDistributorModule extends AbstractModule {

  @Override
  protected void configure() {
    bind(GiftHubRoomDAO.class).to(InMemoryGiftHubRoomDAO.class);
    bind(UserDAO.class).to(InMemoryUserDAO.class);
    bind(GiftHubWebserver.class);
  }

  @Provides
  @Singleton
  public Gson provideGson() {
    Gson gson = new Gson();
    return gson;
  }
}
