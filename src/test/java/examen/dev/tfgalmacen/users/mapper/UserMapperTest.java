package examen.dev.tfgalmacen.users.mapper;

import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.mapper.UserMapper;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private UserMapper userMapper;
    private UserRequest userRequest;
    private User user;

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();

        userRequest = new UserRequest("Raul", "raul@example.com", "password123", Set.of(UserRole.CLIENTE));

        user = User.builder()
                .id(1L)
                .nombre("Raul")
                .correo("raul@example.com")
                .password("password123")
                .roles(Set.of(UserRole.CLIENTE))
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();
    }

    @Test
    void testToEntity() {
        User userEntity = userMapper.toEntity(userRequest);

        assertNotNull(userEntity);
        assertEquals(userRequest.getNombre(), userEntity.getNombre());
        assertEquals(userRequest.getCorreo(), userEntity.getCorreo());
        assertEquals(userRequest.getRoles(), userEntity.getRoles());
        assertEquals(false, userEntity.isDeleted());
    }

    @Test
    void testToDto() {
        UserResponse userResponse = userMapper.toDto(user);

        assertNotNull(userResponse);
        assertEquals(user.getId(), userResponse.getId());
        assertEquals(user.getNombre(), userResponse.getNombre());
        assertEquals(user.getCorreo(), userResponse.getCorreo());
        assertEquals(user.getRoles(), userResponse.getRoles());
    }

    @Test
    void testUpdateUserFromRequest() {
        User updatedUser = new User();
        userMapper.updateUserFromRequest(updatedUser, userRequest);

        assertNotNull(updatedUser);
        assertEquals(userRequest.getNombre(), updatedUser.getNombre());
        assertEquals(userRequest.getCorreo(), updatedUser.getCorreo());
        assertEquals(userRequest.getPassword(), updatedUser.getPassword());
        assertEquals(userRequest.getRoles(), updatedUser.getRoles());
    }
}
