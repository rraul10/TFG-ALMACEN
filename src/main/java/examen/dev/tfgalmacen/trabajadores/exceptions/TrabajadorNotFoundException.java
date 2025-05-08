package examen.dev.tfgalmacen.trabajadores.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TrabajadorNotFoundException extends RuntimeException {
    public TrabajadorNotFoundException(String message) {
        super(message);
    }
}
