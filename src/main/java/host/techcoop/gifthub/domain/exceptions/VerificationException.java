package host.techcoop.gifthub.domain.exceptions;

import com.google.common.collect.ImmutableList;
import host.techcoop.gifthub.domain.UserVote;
import lombok.EqualsAndHashCode;
import lombok.Value;

@Value
@EqualsAndHashCode(callSuper = false)
public class VerificationException extends RuntimeException {

  private final String errorMessage;
  private final ImmutableList<UserVote> currentState;
}
