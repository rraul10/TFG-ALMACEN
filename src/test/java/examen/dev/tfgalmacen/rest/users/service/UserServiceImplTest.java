package examen.dev.tfgalmacen.rest.users.service;

import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
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

        when(clienteRepository.findByUserId(anyLong())).thenReturn(Optional.empty());
        when(trabajadorRepository.findByUserId(anyLong())).thenReturn(Optional.empty());

        List<UserResponse> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(2, result.size());

        UserResponse r1 = result.get(0);
        assertEquals(1L, r1.getId());
        assertEquals("Juan Pérez", r1.getNombre());
        assertEquals("juan.perez@example.com", r1.getCorreo());
        assertEquals(Set.of(UserRole.ADMIN, UserRole.CLIENTE), r1.getRoles());
        assertEquals("ADMIN", r1.getRol());
    }

    @Test
    public void testGetUserById_UserFound() {
        Set<UserRole> roles = new LinkedHashSet<>();
        roles.add(UserRole.ADMIN);
        roles.add(UserRole.CLIENTE);

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
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getNombre(), result.getNombre());
        assertEquals(expectedResponse.getCorreo(), result.getCorreo());
        assertEquals(expectedResponse.getRoles(), result.getRoles());
        assertEquals(expectedResponse.getRol(), result.getRol());
        assertEquals(expectedResponse.getDni(), result.getDni());
        assertEquals(expectedResponse.getFotoDni(), result.getFotoDni());
        assertEquals(expectedResponse.getDireccionEnvio(), result.getDireccionEnvio());
        assertEquals(expectedResponse.getNumeroSeguridadSocial(), result.getNumeroSeguridadSocial());

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
        Set<UserRole> roles = new LinkedHashSet<>();
        roles.add(UserRole.ADMIN);
        roles.add(UserRole.CLIENTE);


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

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        when(clienteRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(trabajadorRepository.findByUserId(1L)).thenReturn(Optional.empty());

        UserResponse result = userService.updateUser(1L, userRequest);

        assertNotNull(result);
        assertEquals("Juan Pérez Actualizado", result.getNombre());
        assertEquals("juan.perez.updated@example.com", result.getCorreo());
        assertEquals("ADMIN", result.getRol());
        assertEquals("", result.getDni());
        assertEquals("", result.getFotoDni());
        assertEquals("", result.getDireccionEnvio());
        assertEquals("", result.getNumeroSeguridadSocial());
    }

    @Test
    void testUpdateUser_cliente() {
        Set<UserRole> roles = Set.of(UserRole.CLIENTE);

        UserRequest request = UserRequest.builder()
                .nombre("Cliente Actualizado")
                .correo("cliente@example.com")
                .roles(roles)
                .dni("12345678Z")
                .fotoDni("dni.jpg")
                .direccionEnvio("Calle Falsa 123")
                .build();

        User user = User.builder().id(1L).nombre("Cliente").correo("cliente@example.com").roles(roles).build();

        Cliente cliente = Cliente.builder().user(user).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenReturn(user);
        when(clienteRepository.findByUserId(1L)).thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUser(1L, request);

        assertNotNull(response);
        assertEquals("Cliente Actualizado", response.getNombre());
        verify(clienteRepository, times(1)).save(any());
        verify(trabajadorRepository, never()).save(any());
    }

    @Test
    void testUpdateUser_trabajador() {
        Set<UserRole> roles = Set.of(UserRole.TRABAJADOR);

        UserRequest request = UserRequest.builder()
                .nombre("Trabajador Actualizado")
                .correo("trabajador@example.com")
                .roles(roles)
                .numeroSeguridadSocial("987654321")
                .build();

        User user = User.builder().id(2L).nombre("Trabajador").correo("trabajador@example.com").roles(roles).build();

        Trabajador trabajador = Trabajador.builder().user(user).build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenReturn(user);
        when(trabajadorRepository.findByUserId(2L)).thenReturn(Optional.of(trabajador));
        when(trabajadorRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUser(2L, request);

        assertNotNull(response);
        assertEquals("Trabajador Actualizado", response.getNombre());
        verify(trabajadorRepository, times(1)).save(any());
        verify(clienteRepository, never()).save(any());
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
