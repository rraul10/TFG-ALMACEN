package examen.dev.tfgalmacen.auth.resetPassword.controller;

import examen.dev.tfgalmacen.auth.resetPassword.models.PasswordResetToken;
import examen.dev.tfgalmacen.auth.resetPassword.services.PasswordResetService;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PasswordResetControllerTest {

    @Mock
    private ClienteService clienteService;

    @Mock
    private PasswordResetService passwordResetService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PasswordResetController passwordResetController;

    private MockMvc mockMvc;
    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(passwordResetController).build();
        mapper = new ObjectMapper();
    }

    @Test
    void testForgotPassword_success() throws Exception {
        String email = "cliente@example.com";

        Cliente cliente = new Cliente();
        cliente.setId(1L);

        PasswordResetToken token = new PasswordResetToken();
        token.setToken("reset-token");

        when(clienteService.getClienteByEmail(email)).thenReturn(cliente);
        when(passwordResetService.createToken(cliente)).thenReturn(token);

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("email", email))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Correo enviado, si existe la cuenta"));

        verify(clienteService).getClienteByEmail(email);
        verify(passwordResetService).createToken(cliente);
        verify(emailService).enviarEmailResetPassword(email, "reset-token");
    }

    @Test
    void testForgotPassword_emailNotFound() throws Exception {
        String email = "noexist@example.com";
        when(clienteService.getClienteByEmail(email)).thenThrow(new RuntimeException("Cliente no encontrado"));

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("email", email))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Correo enviado, si existe la cuenta"));

        verify(clienteService).getClienteByEmail(email);
        verify(passwordResetService, never()).createToken(any());
        verify(emailService, never()).enviarEmailResetPassword(any(), any());
    }

    @Test
    void testResetPassword_success() throws Exception {
        String tokenStr = "reset-token";
        String newPass = "nuevaPassword123";

        Cliente cliente = new Cliente();
        cliente.setId(1L);

        when(passwordResetService.validateToken(tokenStr)).thenReturn(cliente);

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of(
                                "token", tokenStr,
                                "newPassword", newPass
                        ))))
                .andExpect(status().isOk())
                .andExpect(content().string("Contraseña actualizada con éxito."));

        verify(passwordResetService).validateToken(tokenStr);
        verify(passwordResetService).updatePassword(cliente, newPass);
        verify(passwordResetService).deleteToken(tokenStr);
    }

    @Test
    void testResetPassword_invalidToken() throws Exception {
        String tokenStr = "bad-token";
        String newPass = "nuevaPassword123";

        when(passwordResetService.validateToken(tokenStr)).thenThrow(new IllegalArgumentException("Token inválido"));

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of(
                                "token", tokenStr,
                                "newPassword", newPass
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Token inválido"));

        verify(passwordResetService).validateToken(tokenStr);
        verify(passwordResetService, never()).updatePassword(any(), any());
        verify(passwordResetService, never()).deleteToken(any());
    }

    @Test
    void testResetPassword_internalError() throws Exception {
        String tokenStr = "token";
        String newPass = "pass";

        when(passwordResetService.validateToken(tokenStr)).thenThrow(new RuntimeException("DB no disponible"));

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of(
                                "token", tokenStr,
                                "newPassword", newPass
                        ))))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error interno del servidor: DB no disponible"));

        verify(passwordResetService).validateToken(tokenStr);
        verify(passwordResetService, never()).updatePassword(any(), any());
        verify(passwordResetService, never()).deleteToken(any());
    }
}
