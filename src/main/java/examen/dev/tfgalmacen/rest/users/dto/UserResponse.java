package examen.dev.tfgalmacen.rest.users.dto;

import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
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

    public UserResponse(User user) {
        this.id = user.getId();
        this.nombre = user.getNombre();
        this.apellidos = user.getApellidos();
        this.correo = user.getCorreo();
        this.telefono = user.getTelefono();
        this.ciudad = user.getCiudad();
        this.foto = user.getFoto();
        this.roles = user.getRoles();
    }
}


