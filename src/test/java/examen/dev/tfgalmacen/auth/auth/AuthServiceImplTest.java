package examen.dev.tfgalmacen.auth.auth;

import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;
import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.auth.users.repository.AuthUserRepository;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private AuthUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setNombre("Juan");
        user.setCorreo("juan@example.com");
        user.setPassword("password123");
        user.setRoles(Collections.singleton(UserRole.CLIENTE));
    }

    @Test
    void testRegister() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setNombre("Juan");
        request.setCorreo("juan@example.com");
        request.setPassword("password123");
        request.setRole(UserRole.CLIENTE);

        String token = "token-jwt";

        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn(token);

        JwtAuthResponse response = authService.register(request);

        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).notificarRegistroExitoso(user.getCorreo(), user.getNombre());
        assertNotNull(response.getToken());
        assertEquals(token, response.getToken());
    }

    @Test
    void testLogin() {
        UserLoginRequest request = new UserLoginRequest();
        request.setCorreo("juan@example.com");
        request.setPassword("password123");

        String token = "token-jwt";

        when(authenticationManager.authenticate(any())).thenReturn(null);  // Simula autenticación exitosa
        when(userRepository.findByCorreo(request.getCorreo())).thenReturn(java.util.Optional.of(user));
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn(token);

        // Llamada al método de login
        JwtAuthResponse response = authService.login(request);

        // Verificaciones
        verify(authenticationManager, times(1)).authenticate(any());  // Verifica que authenticate fue llamado
        verify(userRepository, times(1)).findByCorreo(request.getCorreo());  // Verifica que findByCorreo fue llamado
        assertNotNull(response.getToken());  // Verifica que el token no sea null
        assertEquals(token, response.getToken());  // Verifica que el token generado es el correcto
    }

    @Test
    void testLogin_UserNotFound() {
        // Preparación
        UserLoginRequest request = new UserLoginRequest();
        request.setCorreo("noexistent@example.com");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByCorreo(request.getCorreo())).thenReturn(java.util.Optional.empty());

        // Llamada al método de login y verificación de la excepción
        assertThrows(UserNotFound.class, () -> authService.login(request));
    }
}
