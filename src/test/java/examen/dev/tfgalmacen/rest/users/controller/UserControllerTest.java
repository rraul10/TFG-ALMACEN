package examen.dev.tfgalmacen.rest.users.controller;

import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.service.UserService;
import examen.dev.tfgalmacen.rest.users.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void testGetAllUsers() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        UserResponse userResponse1 = new UserResponse(1L, "Juan Pérez", "juan.perez@example.com", roles);
        UserResponse userResponse2 = new UserResponse(2L, "Ana Gómez", "ana.gomez@example.com", roles);

        when(userService.getAllUsers()).thenReturn(Arrays.asList(userResponse1, userResponse2));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].nombre").value("Juan Pérez"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].nombre").value("Ana Gómez"));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    public void testGetUserById() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        UserResponse userResponse = new UserResponse(1L, "Juan Pérez", "juan.perez@example.com", roles);

        when(userService.getUserById(1L)).thenReturn(userResponse);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Juan Pérez"));

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    public void testCreateUser() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        UserRequest userRequest = new UserRequest("Juan Pérez", "juan.perez@example.com", "password123", roles);
        UserResponse userResponse = new UserResponse(1L, "Juan Pérez", "juan.perez@example.com", roles);

        when(userService.createUser(any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Juan Pérez\", \"correo\":\"juan.perez@example.com\", \"password\":\"password123\", \"roles\":[\"ADMIN\",\"CLIENTE\"]}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Juan Pérez"));

        verify(userService, times(1)).createUser(any(UserRequest.class));
    }

    @Test
    public void testUpdateUser() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        UserRequest userRequest = new UserRequest("Juan Pérez Actualizado", "juan.perez.updated@example.com", "newpassword123", roles);
        UserResponse userResponse = new UserResponse(1L, "Juan Pérez Actualizado", "juan.perez.updated@example.com", roles);

        when(userService.updateUser(eq(1L), any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Juan Pérez Actualizado\", \"correo\":\"juan.perez.updated@example.com\", \"password\":\"newpassword123\", \"roles\":[\"ADMIN\",\"CLIENTE\"]}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Juan Pérez Actualizado"));

        verify(userService, times(1)).updateUser(eq(1L), any(UserRequest.class));
    }

    @Test
    public void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(1L);
    }
}
