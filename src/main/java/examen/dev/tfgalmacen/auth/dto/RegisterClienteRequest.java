package examen.dev.tfgalmacen.auth.dto;

import lombok.Data;

@Data
public class RegisterClienteRequest {
    private String nombre;
    private String correo;
    private String password;
    private String dni;
    private String fotoDni;
    private String direccionEnvio;
}

