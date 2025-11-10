package examen.dev.tfgalmacen.rest.users.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Builder
@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nombre;
    private String apellidos;
    private String correo;
    private String telefono;
    private String ciudad;
    private String foto;
    private Set<UserRole> roles;
}

