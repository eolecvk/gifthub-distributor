package host.techcoop.gifthub.modules;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Names;
import host.techcoop.gifthub.GiftHubWebserver;
import host.techcoop.gifthub.InMemoryGiftHubRoomDAO;
import host.techcoop.gifthub.WordGenerator;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.domain.requests.events.AdjustEvent;
import host.techcoop.gifthub.domain.requests.events.EmotiveEvent;
import host.techcoop.gifthub.domain.requests.events.UserUpdateEvent;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import host.techcoop.gifthub.vendored.RuntimeTypeAdapterFactory;
import java.io.File;
import lombok.SneakyThrows;

public class GiftHubDistributorModule extends AbstractModule {

  @SneakyThrows
  @Override
  protected void configure() {
    bind(GiftHubRoomDAO.class).to(InMemoryGiftHubRoomDAO.class);
    bind(WordGenerator.class);
    bind(GiftHubWebserver.class);
    bind(File.class)
        .annotatedWith(Names.named("WordFile"))
        .toInstance(new File(getClass().getClassLoader().getResource("words.txt").toURI()));
  }

  @Provides
  @Singleton
  public Gson provideGson() {
    Gson gson =
        new GsonBuilder()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapterFactory(
                RuntimeTypeAdapterFactory.of(Event.class, "kind")
                    .registerSubtype(AdjustEvent.class, "ADJUST")
                    .registerSubtype(EmotiveEvent.class, "EMOTIVE")
                    .registerSubtype(UserUpdateEvent.class, "USER_UPDATE"))
            .create();
    return gson;
  }
}
