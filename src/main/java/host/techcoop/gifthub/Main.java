package host.techcoop.gifthub;

import com.google.inject.Guice;
import com.google.inject.Injector;
import host.techcoop.gifthub.domain.GiftHubRoom;

import host.techcoop.gifthub.modules.GiftHubDistributorModule;
import java.util.ArrayList;

import static spark.Spark.*;


public class Main {
    public static void main(String[] args) {
        Injector injector = Guice.createInjector(new GiftHubDistributorModule());
        GiftHubWebserver server = injector.getInstance(GiftHubWebserver.class);
        server.init();
    }
}
