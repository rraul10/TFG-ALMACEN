package examen.dev.tfgalmacen.rest.users.service;

import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.trabajadores.repository.TrabajadorRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.mapper.UserMapper;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private EmailService emailService;

    @Mock
    private TrabajadorRepository trabajadorRepository;

    private UserServiceImpl userService;

    @Mock
    private ClienteRepository clienteRepository;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl(
                userRepository,
                userMapper,
                emailService,
                null,
                clienteRepository,
                trabajadorRepository
        );
    }


    @Test
    public void testGetAllUsers() {
        Set<UserRole> roles = Set.of(UserRole.ADMIN, UserRole.CLIENTE);

        User user1 = User.builder().id(1L).nombre("Juan Pérez").correo("juan.perez@example.com").roles(roles).build();
        User user2 = User.builder().id(2L).nombre("Ana Gómez").correo("ana.gomez@example.com").roles(roles).build();

        List<User> users = List.of(user1, user2);

        when(userRepository.findAll()).thenReturn(users);

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

        when(userMapper.toDto(user1)).thenReturn(userResponse1);
        when(userMapper.toDto(user2)).thenReturn(userResponse2);

        List<UserResponse> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(userResponse1, result.get(0));
        assertEquals(userResponse2, result.get(1));

        verify(userRepository, times(1)).findAll();
        verify(userMapper, times(1)).toDto(user1);
        verify(userMapper, times(1)).toDto(user2);
    }

    @Test
    public void testGetUserById_UserFound() {
        Set<UserRole> roles = Set.of(UserRole.ADMIN, UserRole.CLIENTE);

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        UserResponse expectedResponse = new UserResponse();
        expectedResponse.setId(1L);
        expectedResponse.setNombre("Juan Pérez");
        expectedResponse.setCorreo("juan.perez@example.com");
        expectedResponse.setRoles(roles);
        expectedResponse.setRol("ADMIN");
        expectedResponse.setDni("");
        expectedResponse.setFotoDni("");
        expectedResponse.setDireccionEnvio("");
        expectedResponse.setNumeroSeguridadSocial("");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(expectedResponse, result);

        verify(userRepository, times(1)).findById(1L);
    }


    @Test
    public void testGetUserById_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFound.class, () -> userService.getUserById(1L));

        verify(userRepository, times(1)).findById(1L);
        verify(userMapper, times(0)).toDto(any());
    }

    @Test
    void testCreateUser_Trabajador() {
        Set<UserRole> roles = Set.of(UserRole.TRABAJADOR);

        UserRequest userRequest = UserRequest.builder()
                .nombre("Pedro Trabajador")
                .correo("pedro@example.com")
                .password("pass123")
                .roles(roles)
                .numeroSeguridadSocial("123456789")
                .build();

        User user = User.builder()
                .id(2L)
                .nombre("Pedro Trabajador")
                .correo("pedro@example.com")
                .roles(roles)
                .build();

        when(userMapper.toEntity(userRequest)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(trabajadorRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        UserResponse response = userService.createUser(userRequest);

        assertNotNull(response);
        assertEquals("Pedro Trabajador", response.getNombre());
        verify(trabajadorRepository, times(1)).save(any());
    }



    @Test
    public void testUpdateUser() {
        Set<UserRole> roles = Set.of(UserRole.ADMIN, UserRole.CLIENTE);

        UserRequest userRequest = UserRequest.builder()
                .nombre("Juan Pérez Actualizado")
                .correo("juan.perez.updated@example.com")
                .password("newpassword123")
                .roles(roles)
                .build();

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .nombre("Juan Pérez Actualizado")
                .correo("juan.perez.updated@example.com")
                .roles(roles)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        doAnswer(invocation -> {
            user.setNombre(userRequest.getNombre());
            user.setCorreo(userRequest.getCorreo());
            return null;
        }).when(userMapper).updateUserFromRequest(user, userRequest);

        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userResponse);

        UserResponse result = userService.updateUser(1L, userRequest);

        assertNotNull(result);
        assertEquals(userResponse, result);

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(user);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    public void testDeleteUser() {
        Set<UserRole> roles = Set.of(UserRole.ADMIN, UserRole.CLIENTE);

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(user);
        assertTrue(user.isDeleted(), "El usuario debería estar marcado como eliminado");
    }
}
