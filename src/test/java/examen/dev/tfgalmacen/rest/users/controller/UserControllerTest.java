package examen.dev.tfgalmacen.rest.users.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.service.UserService;
import examen.dev.tfgalmacen.rest.users.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
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

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testGetAllUsers() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));

        UserResponse userResponse1 = UserResponse.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        UserResponse userResponse2 = UserResponse.builder()
                .id(2L)
                .nombre("Ana Gómez")
                .correo("ana.gomez@example.com")
                .roles(roles)
                .build();

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

        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        when(userService.getUserById(1L)).thenReturn(userResponse);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Juan Pérez"));

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    public void testCreateUserWithMultipart() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));

        UserRequest userRequest = UserRequest.builder()
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .password("password123")
                .roles(roles)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        when(userService.createUser(any(UserRequest.class))).thenReturn(userResponse);

        String userJson = objectMapper.writeValueAsString(userRequest);
        MockMultipartFile userPart = new MockMultipartFile("user", "", "application/json", userJson.getBytes());
        MockMultipartFile fotoPart = new MockMultipartFile("foto", new byte[0]); // archivo vacío opcional

        mockMvc.perform(multipart("/api/users")
                        .file(userPart)
                        .file(fotoPart))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Juan Pérez"));

        verify(userService, times(1)).createUser(any(UserRequest.class));
    }

    @Test
    public void testUpdateUser_Multipart() throws Exception {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));

        UserRequest userRequest = UserRequest.builder()
                .nombre("Juan Pérez Actualizado")
                .correo("juan.perez.updated@example.com")
                .password("newpassword123")
                .roles(roles)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .nombre("Juan Pérez Actualizado")
                .correo("juan.perez.updated@example.com")
                .roles(roles)
                .rol("ADMIN")
                .build();

        when(userService.updateUser(eq(1L), any(UserRequest.class))).thenReturn(userResponse);

        String userJson = objectMapper.writeValueAsString(userRequest);

        mockMvc.perform(multipart("/api/users/1")
                        .file(new MockMultipartFile("user", "", "application/json", userJson.getBytes()))
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Juan Pérez Actualizado"))
                .andExpect(jsonPath("$.correo").value("juan.perez.updated@example.com"))
                .andExpect(jsonPath("$.rol").value("ADMIN"));

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
