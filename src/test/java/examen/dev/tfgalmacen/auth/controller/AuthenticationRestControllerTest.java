package examen.dev.tfgalmacen.auth.controller;

import examen.dev.tfgalmacen.auth.auth.AuthService;
import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;
import examen.dev.tfgalmacen.auth.dto.UserProfileResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthenticationRestControllerTest {

    @InjectMocks
    private AuthenticationRestController authenticationRestController;

    @Mock
    private AuthService authService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authenticationRestController).build();
    }

    @Test
    void testLogin() throws Exception {
        JwtAuthResponse jwtAuthResponse =
                new JwtAuthResponse("fake-jwt-token", new UserProfileResponse());

        when(authService.login(any(UserLoginRequest.class))).thenReturn(jwtAuthResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "correo":"juan@example.com",
                                  "password":"password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));

        verify(authService, times(1)).login(any(UserLoginRequest.class));
    }

    @Test
    void testRegister() throws Exception {

        JwtAuthResponse jwtAuthResponse =
                new JwtAuthResponse("fake-jwt-token", new UserProfileResponse());

        when(authService.register(any(RegisterUserRequest.class))).thenReturn(jwtAuthResponse);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre":"Juan",
                                  "correo":"juan@example.com",
                                  "password":"password123",
                                  "role":"CLIENTE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));

        verify(authService, times(1)).register(any(RegisterUserRequest.class));
    }

    @Test
    void testRegisterCliente() throws Exception {

        JwtAuthResponse jwtAuthResponse =
                new JwtAuthResponse("fake-jwt-token", new UserProfileResponse());

        when(authService.registerCliente(any(RegisterClienteRequest.class))).thenReturn(jwtAuthResponse);

        mockMvc.perform(post("/auth/register/cliente")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre":"Juan",
                                  "apellidos":"Pérez",
                                  "correo":"cliente@example.com",
                                  "password":"abc123",
                                  "dni":"12345678A",
                                  "direccionEnvio":"Calle Falsa 123",
                                  "telefono":"600000000",
                                  "ciudad":"Madrid"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));

        verify(authService, times(1)).registerCliente(any(RegisterClienteRequest.class));
    }
}
