package examen.dev.tfgalmacen.auth.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String nombre;
    private String correo;
    private Set<UserRole> roles;

    // Campos del cliente
    private String dni;
    private String fotoDni;
    private String direccionEnvio;

    // Campos del usuario
    private String apellidos;
    private String telefono;
    private String ciudad;
    private String foto;
}


