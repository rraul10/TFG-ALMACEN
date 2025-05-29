package examen.dev.tfgalmacen.auth.users.service;

import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;

import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthUserServiceImplTest {

    private AuthUserRepository userRepository;
    private AuthUserServiceImpl authUserService;

    @BeforeEach
    void setUp() {
        userRepository = mock(AuthUserRepository.class);
        authUserService = new AuthUserServiceImpl(userRepository);
    }

    @Test
    void testLoadUserByUsernameUserFound() {
        String email = "test@example.com";

        User user = new User();
        user.setCorreo(email);
        user.setPassword("1234");

        when(userRepository.findByCorreo(email)).thenReturn(Optional.of(user));

        var result = authUserService.loadUserByUsername(email);

        assertNotNull(result);
        assertEquals(email, result.getUsername());
    }

    @Test
    void testLoadUserByUsernameUserNotFound() {
        String email = "notfound@example.com";
        when(userRepository.findByCorreo(email)).thenReturn(Optional.empty());

        assertThrows(UserNotFound.class, () -> authUserService.loadUserByUsername(email));
    }
}
