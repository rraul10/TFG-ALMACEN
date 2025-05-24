package examen.dev.tfgalmacen.auth.exceptions;

public class UserNotFound extends RuntimeException {
    public UserNotFound (String message) {
        super(message);
    }
}
