package examen.dev.tfgalmacen.auth.exceptions;

public class UserNotAuthorized extends RuntimeException {
    public UserNotAuthorized (String message) {
        super(message);
    }
}

