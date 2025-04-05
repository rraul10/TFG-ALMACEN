package examen.dev.tfgalmacen.auth.dto;

import examen.dev.tfgalmacen.users.models.Role;
import lombok.Data;

@Data
public class RegisterUserRequest {
    private String nombre;
    private String correo;
    private String password;
    private Role role;
}
