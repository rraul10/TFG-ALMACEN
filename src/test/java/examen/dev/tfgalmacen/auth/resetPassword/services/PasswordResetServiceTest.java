package examen.dev.tfgalmacen.auth.resetPassword.services;

import examen.dev.tfgalmacen.auth.resetPassword.models.PasswordResetToken;
import examen.dev.tfgalmacen.auth.resetPassword.repository.PasswordResetTokenRepository;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PasswordResetServiceTest {

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private ClienteService clienteService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private Cliente cliente;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setCorreo("test@example.com");
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setUser(user);
    }

    @Test
    void testCreateToken() {
        PasswordResetToken savedToken = PasswordResetToken.builder()
                .cliente(cliente)
                .token("token123")
                .expiration(LocalDateTime.now().plusHours(1))
                .build();

        when(tokenRepository.save(any())).thenReturn(savedToken);

        PasswordResetToken result = passwordResetService.createToken(cliente);

        assertNotNull(result);
        assertEquals(cliente, result.getCliente());
        assertNotNull(result.getToken());
        verify(tokenRepository, times(1)).save(any());
    }

    @Test
    void testValidateToken_ok() {
        PasswordResetToken token = PasswordResetToken.builder()
                .cliente(cliente)
                .token("valid-token")
                .expiration(LocalDateTime.now().plusHours(1))
                .build();

        when(tokenRepository.findByToken("valid-token")).thenReturn(Optional.of(token));

        Cliente result = passwordResetService.validateToken("valid-token");

        assertEquals(cliente, result);
    }

    @Test
    void testValidateToken_notFound() {
        when(tokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                passwordResetService.validateToken("invalid-token")
        );

        assertEquals("Token inválido", exception.getMessage());
    }

    @Test
    void testValidateToken_expired() {
        PasswordResetToken token = PasswordResetToken.builder()
                .cliente(cliente)
                .token("expired-token")
                .expiration(LocalDateTime.now().minusMinutes(1))
                .build();

        when(tokenRepository.findByToken("expired-token")).thenReturn(Optional.of(token));

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                passwordResetService.validateToken("expired-token")
        );

        assertEquals("Token expirado", exception.getMessage());
    }

    @Test
    void testDeleteToken_present() {
        PasswordResetToken token = PasswordResetToken.builder()
                .token("tokenToDelete")
                .cliente(cliente)
                .build();

        when(tokenRepository.findByToken("tokenToDelete")).thenReturn(Optional.of(token));

        passwordResetService.deleteToken("tokenToDelete");

        verify(tokenRepository).delete(token);
    }

    @Test
    void testDeleteToken_notPresent() {
        when(tokenRepository.findByToken("nonexistent")).thenReturn(Optional.empty());

        passwordResetService.deleteToken("nonexistent");

        verify(tokenRepository, never()).delete(any());
    }

    @Test
    void testUpdatePassword() {
        String newPassword = "newPass123";
        String encodedPassword = "encodedPass";

        when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);

        passwordResetService.updatePassword(cliente, newPassword);

        assertEquals(encodedPassword, user.getPassword());
        verify(userRepository).save(user);
        verify(clienteService).updateClienteEntity(cliente);
        assertNotNull(cliente.getUpdated());
    }
}
