package examen.dev.tfgalmacen.clientes.exceptions;

public class ClienteNotFound extends RuntimeException {
    public ClienteNotFound (String message) {
        super(message);
    }
}
