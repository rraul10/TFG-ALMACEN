package examen.dev.tfgalmacen.rest.clientes.exceptions;

public class ClienteNotFound extends RuntimeException {
    public ClienteNotFound (String message) {
        super(message);
    }
}
