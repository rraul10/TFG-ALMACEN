package examen.dev.tfgalmacen.users.dto;

import examen.dev.tfgalmacen.users.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nombre;
    private String correo;
    private Set<UserRole> roles;
    private LocalDateTime created;
    private LocalDateTime updated;
}
