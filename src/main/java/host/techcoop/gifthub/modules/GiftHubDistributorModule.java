package host.techcoop.gifthub.modules;

import static host.techcoop.gifthub.domain.enums.EventKind.*;

import com.google.common.collect.ImmutableList;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import host.techcoop.gifthub.GiftHubWebserver;
import host.techcoop.gifthub.InMemoryGiftHubRoomDAO;
import host.techcoop.gifthub.WordGenerator;
import host.techcoop.gifthub.domain.interfaces.Event;
import host.techcoop.gifthub.domain.requests.events.AdjustEvent;
import host.techcoop.gifthub.domain.requests.events.EmotiveEvent;
import host.techcoop.gifthub.domain.requests.events.RecipientAddEvent;
import host.techcoop.gifthub.domain.requests.events.RecipientRemoveEvent;
import host.techcoop.gifthub.domain.requests.events.RecipientUpdateEvent;
import host.techcoop.gifthub.domain.requests.events.RoomUpdateEvent;
import host.techcoop.gifthub.domain.requests.events.VoterRemoveEvent;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import host.techcoop.gifthub.vendored.RuntimeTypeAdapterFactory;
import java.io.File;
import java.nio.file.Files;
import java.util.List;
import lombok.SneakyThrows;

public class GiftHubDistributorModule extends AbstractModule {

  @SneakyThrows
  @Override
  protected void configure() {
    bind(GiftHubRoomDAO.class).to(InMemoryGiftHubRoomDAO.class);
    bind(WordGenerator.class);
    bind(GiftHubWebserver.class);
  }

  @Provides
  @Singleton
  public Gson provideGson() {
    Gson gson =
        new GsonBuilder()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapterFactory(
                RuntimeTypeAdapterFactory.of(Event.class, "kind")
                    .registerSubtype(AdjustEvent.class, ADJUST.toString())
                    .registerSubtype(EmotiveEvent.class, EMOTIVE.toString())
                    .registerSubtype(RecipientUpdateEvent.class, RECIPIENT_UPDATE.toString())
                    .registerSubtype(RecipientAddEvent.class, RECIPIENT_ADD.toString())
                    .registerSubtype(RecipientRemoveEvent.class, RECIPIENT_REMOVE.toString())
                    .registerSubtype(RoomUpdateEvent.class, ROOM_UPDATE.toString())
                    .registerSubtype(VoterRemoveEvent.class, VOTER_REMOVE.toString()))
            .create();
    return gson;
  }

  @Provides
  @Singleton
  @Named("WordList")
  @SneakyThrows
  public List<String> provideWordList() {
    File wordFile = new File(getClass().getClassLoader().getResource("words.txt").toURI());
    return Files.lines(wordFile.toPath()).collect(ImmutableList.toImmutableList());
  }
}
