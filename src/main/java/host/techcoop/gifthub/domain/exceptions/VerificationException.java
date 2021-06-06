package host.techcoop.gifthub.domain.exceptions;

import com.google.common.collect.ImmutableList;
import host.techcoop.gifthub.domain.UserVote;
import java.util.List;
import lombok.Value;

@Value
public class VerificationException extends RuntimeException{

  private final String errorMessage;
  private final ImmutableList<UserVote> currentState;

}
