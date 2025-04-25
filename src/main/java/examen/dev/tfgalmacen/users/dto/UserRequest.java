package examen.dev.tfgalmacen.users.dto;

import examen.dev.tfgalmacen.users.UserRole;
import lombok.Data;

import java.util.Set;

@Data
public class UserRequest {
    private String nombre;
    private String correo;
    private String password;
    private Set<UserRole> roles;
}

