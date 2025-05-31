package examen.dev.tfgalmacen.auth.users.service;

import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;

import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthUserServiceImplTest {

    private AuthUserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private ClienteRepository clienteRepository;
    private JwtService jwtService;
    private AuthUserServiceImpl authUserService;

    @BeforeEach
    void setUp() {
        userRepository = mock(AuthUserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        clienteRepository = mock(ClienteRepository.class);
        jwtService = mock(JwtService.class);

        authUserService = new AuthUserServiceImpl(
                userRepository,
                passwordEncoder,
                clienteRepository,
                jwtService
        );
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
