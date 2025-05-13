package examen.dev.tfgalmacen.rest.users.mapper;

import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserMapper {

    public User toEntity(UserRequest userRequest) {
        return User.builder()
                .nombre(userRequest.getNombre())
                .correo(userRequest.getCorreo())
                .password(userRequest.getPassword())
                .roles(userRequest.getRoles())
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();
    }

    public UserResponse toDto(User user) {
        return new UserResponse(
                user.getId(),
                user.getNombre(),
                user.getCorreo(),
                user.getRoles()
        );
    }

    public void updateUserFromRequest(User user, UserRequest userRequest) {
        user.setNombre(userRequest.getNombre());
        user.setCorreo(userRequest.getCorreo());
        user.setPassword(userRequest.getPassword());
        user.setRoles(userRequest.getRoles());
        user.setUpdated(LocalDateTime.now());
    }
}
