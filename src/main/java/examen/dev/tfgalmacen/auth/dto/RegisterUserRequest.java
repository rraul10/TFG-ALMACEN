package examen.dev.tfgalmacen.auth.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import lombok.Data;

@Data
public class RegisterUserRequest {
    private String nombre;
    private String apellidos;
    private String correo;
    private String telefono;
    private String ciudad;
    private String password;
    private String role;

}
