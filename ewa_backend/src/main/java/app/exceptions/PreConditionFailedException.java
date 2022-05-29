package app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PreConditionFailedException extends Exception {
  public PreConditionFailedException(String message){
    super(message);
  }
}
