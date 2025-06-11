package examen.dev.tfgalmacen.auth.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import lombok.Data;

@Data
public class RegisterUserRequest {
    private String nombre;
    private String correo;
    private String password;
    private UserRole role;
}
