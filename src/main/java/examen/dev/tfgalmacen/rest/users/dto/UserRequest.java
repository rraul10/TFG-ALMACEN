package examen.dev.tfgalmacen.rest.users.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String nombre;
    private String correo;
    private String password;
    private Set<UserRole> roles;
}

