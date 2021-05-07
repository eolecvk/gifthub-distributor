package host.techcoop.gifthub;

import static spark.Spark.*;

import com.google.inject.Guice;
import com.google.inject.Injector;
import host.techcoop.gifthub.modules.GiftHubDistributorModule;

public class Main {
  public static void main(String[] args) {
    Injector injector = Guice.createInjector(new GiftHubDistributorModule());
    GiftHubWebserver server = injector.getInstance(GiftHubWebserver.class);
    server.init();
  }
}
