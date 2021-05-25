package host.techcoop.gifthub;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.inject.Guice;
import com.google.inject.Injector;
import host.techcoop.gifthub.domain.requests.UpdateRequest;
import host.techcoop.gifthub.modules.GiftHubDistributorModule;

public class Main {
  public static void main(String[] args) {
    Injector injector = Guice.createInjector(new GiftHubDistributorModule());
    GiftHubWebserver server = injector.getInstance(GiftHubWebserver.class);
    Gson gson = injector.getInstance(Gson.class);
    UpdateRequest request = gson.fromJson("{\"events\":[{\"kind\": \"ADJUST\",\"bar_id\": 1234, \"new_value\": 0.5},{\"kind\": \"EMOTIVE\",\"emotion\":\"smiley face\",\"bar_id\": 1234 },{\"kind\":\"NEEDS_UPDATE\",\"needs_description\": \"i needs it\", \"needs_upper_bound_cents\": 1234,\"needs_lower_bound_cents\": 1234}]}",
        UpdateRequest.class);
    System.out.println(request);
    server.init();
  }
}
