package examen.dev.tfgalmacen.auth.users.service;

import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.UserProfileResponse;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

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

    @Test
    void testRegisterCliente() {
        RegisterClienteRequest request = new RegisterClienteRequest();
        request.setNombre("Juan");
        request.setCorreo("juan@example.com");
        request.setPassword("12345");
        request.setDni("12345678A");
        request.setFotoDni("foto.jpg");
        request.setDireccionEnvio("Calle Falsa 123");

        when(passwordEncoder.encode("12345")).thenReturn("encoded-12345");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setNombre("Juan");
        savedUser.setCorreo("juan@example.com");
        savedUser.setRoles(Set.of(UserRole.CLIENTE));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        when(jwtService.generateToken(savedUser)).thenReturn("jwt-token-123");

        JwtAuthResponse response = authUserService.registerCliente(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User userToSave = userCaptor.getValue();
        assertEquals("Juan", userToSave.getNombre());
        assertEquals("juan@example.com", userToSave.getCorreo());
        assertEquals("encoded-12345", userToSave.getPassword());
        assertTrue(userToSave.getRoles().contains(UserRole.CLIENTE));

        ArgumentCaptor<Cliente> clienteCaptor = ArgumentCaptor.forClass(Cliente.class);
        verify(clienteRepository).save(clienteCaptor.capture());
        Cliente clienteSaved = clienteCaptor.getValue();
        assertEquals("12345678A", clienteSaved.getDni());
        assertEquals("foto.jpg", clienteSaved.getFotoDni());
        assertEquals("Calle Falsa 123", clienteSaved.getDireccionEnvio());
        assertEquals(savedUser, clienteSaved.getUser());

        assertEquals("jwt-token-123", response.getToken());

        UserProfileResponse profile = response.getUser();
        assertNotNull(profile);
        assertEquals(1L, profile.getId());
        assertEquals("Juan", profile.getNombre());
        assertEquals("juan@example.com", profile.getCorreo());
        assertEquals("12345678A", profile.getDni());
        assertEquals("foto.jpg", profile.getFotoDni());
        assertEquals("Calle Falsa 123", profile.getDireccionEnvio());
        assertTrue(profile.getRoles().contains(UserRole.CLIENTE));
    }
}
