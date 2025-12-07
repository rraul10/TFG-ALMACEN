package examen.dev.tfgalmacen.auth.auth;

import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import java.util.Optional;


class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock private AuthUserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private EmailService emailService;
    @Mock private ClienteRepository clienteRepository;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setNombre("Raul");
        user.setCorreo("raul@example.com");
        user.setPassword("encodedPassword");
        user.setRoles(Collections.singleton(UserRole.CLIENTE));
    }

    @Test
    void testRegister() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setNombre("Raul");
        request.setCorreo("raul@example.com");
        request.setPassword("password123");
        request.setRole("CLIENTE");

        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        JwtAuthResponse response = authService.register(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).notificarRegistroExitoso(anyString(), anyString());

        assertNotNull(response.getToken());
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void testLogin() {
        UserLoginRequest request = new UserLoginRequest();
        request.setCorreo("raul@example.com");
        request.setPassword("password123");

        when(userRepository.findByCorreo(request.getCorreo()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .thenReturn(true);

        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        JwtAuthResponse response = authService.login(request);

        verify(userRepository, times(1)).findByCorreo(request.getCorreo());
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void testLogin_UserNotFound() {
        UserLoginRequest request = new UserLoginRequest();
        request.setCorreo("missing@example.com");
        request.setPassword("password");

        when(userRepository.findByCorreo(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }


    @Test
    void testRegisterCliente_ok() {
        RegisterClienteRequest request = new RegisterClienteRequest();
        request.setNombre("Juan");
        request.setApellidos("Pérez");
        request.setCorreo("juan@example.com");
        request.setPassword("123456");
        request.setTelefono("123456789");
        request.setCiudad("Madrid");
        request.setDni("12345678A");
        request.setDireccionEnvio("Calle Falsa 123");
        request.setFotoDni("dni.jpg");

        when(passwordEncoder.encode("123456")).thenReturn("hashedPassword");

        doAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        }).when(userRepository).save(any(User.class));

        doAnswer(invocation -> {
            Cliente c = invocation.getArgument(0);
            c.setId(1L);
            return c;
        }).when(clienteRepository).save(any(Cliente.class));

        when(jwtService.generateToken(any(User.class))).thenReturn("fake-jwt-token");

        JwtAuthResponse response = authService.registerCliente(request);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("Juan", response.getUser().getNombre());
        assertEquals("12345678A", response.getUser().getDni());
        assertEquals("dni.jpg", response.getUser().getFotoDni());
        assertEquals(Collections.singleton(UserRole.CLIENTE), response.getUser().getRoles());

        verify(userRepository, times(1)).save(any(User.class));
        verify(clienteRepository, times(1)).save(any(Cliente.class));
        verify(jwtService, times(1)).generateToken(any(User.class));
        verify(emailService, times(1)).notificarRegistroExitoso("juan@example.com", "Juan");
    }
}

