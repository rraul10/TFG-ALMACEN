package examen.dev.tfgalmacen.rest.users.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String nombre;
    private String apellidos;
    private String correo;
    private String telefono;
    private String ciudad;
    private String foto;
    private Set<UserRole> roles;
    private String rol;
    private String dni;
    private String fotoDni;
    private String direccionEnvio;

    // Constructor desde entidad User
    public UserResponse(User user) {
        this.id = user.getId();
        this.nombre = user.getNombre();
        this.apellidos = user.getApellidos();
        this.correo = user.getCorreo();
        this.telefono = user.getTelefono();
        this.ciudad = user.getCiudad();
        this.foto = user.getFoto();
        this.roles = user.getRoles();
        if (user.getRoles() != null && !user.getRoles().isEmpty())
            this.rol = user.getRoles().iterator().next().name();
    }
}


