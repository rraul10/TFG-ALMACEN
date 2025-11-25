package examen.dev.tfgalmacen.rest.users.mapper;

import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserMapper {

    public UserResponse toDto(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellidos(user.getApellidos());
        dto.setCorreo(user.getCorreo());
        dto.setTelefono(user.getTelefono());
        dto.setCiudad(user.getCiudad());
        dto.setFoto(user.getFoto());
        dto.setRoles(user.getRoles());

        if (user.getCliente() != null) {
            dto.setDni(user.getCliente().getDni());
            dto.setFotoDni(user.getCliente().getFotoDni());
            dto.setDireccionEnvio(user.getCliente().getDireccionEnvio());
        }

        return dto;
    }

    public User toEntity(UserRequest userRequest) {
        return User.builder()
                .nombre(userRequest.getNombre())
                .apellidos(userRequest.getApellidos())
                .correo(userRequest.getCorreo())
                .password(userRequest.getPassword())
                .telefono(userRequest.getTelefono())
                .ciudad(userRequest.getCiudad())
                .foto(userRequest.getFoto())
                .roles(userRequest.getRoles())
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();
    }

    public void updateUserFromRequest(User user, UserRequest userRequest) {
        user.setNombre(userRequest.getNombre());
        user.setApellidos(userRequest.getApellidos());
        user.setCorreo(userRequest.getCorreo());
        user.setPassword(userRequest.getPassword());
        user.setTelefono(userRequest.getTelefono());
        user.setCiudad(userRequest.getCiudad());
        user.setFoto(userRequest.getFoto());
        user.setRoles(userRequest.getRoles());
        user.setUpdated(LocalDateTime.now());
    }
}
