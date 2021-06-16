package host.techcoop.gifthub.domain.responses;

import host.techcoop.gifthub.domain.UserVote;
import host.techcoop.gifthub.domain.exceptions.VerificationException;
import java.util.List;
import lombok.Value;

@Value
public class ErrorResponse {
  List<UserVote> currentState;
  String errorMessage;

  public static ErrorResponse from(VerificationException e) {
    return new ErrorResponse(e.getCurrentState(), e.getErrorMessage());
  }
}
