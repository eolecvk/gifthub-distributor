package host.techcoop.gifthub;

import static com.google.common.truth.Truth.*;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

import host.techcoop.gifthub.domain.GiftHubRoom;
import host.techcoop.gifthub.domain.exceptions.PermissionsException;
import host.techcoop.gifthub.interfaces.GiftHubRoomDAO;
import host.techcoop.gifthub.modules.GiftHubDistributorModule;
import org.junit.Before;
import org.junit.Test;
import spark.Request;
import spark.Response;
import spark.Session;

public class GifthubWebserverTest {
  public GiftHubWebserver instance;
  public GiftHubRoomDAO roomDAO;
  public Request request;
  public Response response;
  public Session session;

  @Before
  public void setUp() {
    roomDAO = mock(GiftHubRoomDAO.class);
    instance = new GiftHubWebserver(roomDAO, new GiftHubDistributorModule().provideGson());
    request = mock(Request.class);
    response = mock(Response.class);
    session = mock(Session.class);
    when(request.params(":roomCode")).thenReturn("ABCD");
    when(request.session()).thenReturn(session);
    when(session.attribute(GiftHubWebserver.SESSION_ROOM_KEY)).thenReturn("ABCD");
  }

  @Test
  public void getRoomInfoReturnsValidInfo() {
    when(roomDAO.getRoomByCode("ABCD"))
        .thenReturn(
            GiftHubRoom.EMPTY_ROOM.toBuilder()
                .code("ABCD")
                .roomName("Monkeys")
                .splittingCents(50)
                .build());
    GiftHubRoom roomInfoResponse = instance.getRoomInfo(request, response);
    assertThat(roomInfoResponse.getRoomName()).isEqualTo("Monkeys");
    assertThat(roomInfoResponse.getSplittingCents()).isEqualTo(50);
    assertThat(roomInfoResponse.getCode()).isEqualTo("ABCD");
  }

  @Test
  public void getRoomInfoThrowsExceptionIfNoValidSession() {
    when(session.attribute(GiftHubWebserver.SESSION_ROOM_KEY)).thenReturn("BCDE");
    assertThrows(PermissionsException.class, () -> instance.getRoomInfo(request, response));
  }

  @Test
  public void processEventsSuccessfullyProcesses() {
    when(request.body()).thenReturn("");
    assertThrows(PermissionsException.class, () -> instance.processEvents(request, response));
  }

  @Test
  public void processEventsThrowsExceptionIfNoValidSession() {
    when(session.attribute(GiftHubWebserver.SESSION_ROOM_KEY)).thenReturn("BCDE");
    assertThrows(PermissionsException.class, () -> instance.processEvents(request, response));
  }
}
