package examen.dev.tfgalmacen.rest.users.service;

import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.mapper.UserMapper;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
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

    private UserServiceImpl userService;

    @Mock
    private EmailService emailService;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl(userRepository, userMapper, emailService);
    }

    @Test
    public void testGetAllUsers() {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        User user1 = User.builder().id(1L).nombre("Juan Pérez").correo("juan.perez@example.com").roles(roles).build();
        User user2 = User.builder().id(2L).nombre("Ana Gómez").correo("ana.gomez@example.com").roles(roles).build();
        List<User> users = Arrays.asList(user1, user2);

        when(userRepository.findAll()).thenReturn(users);

        UserResponse userResponse1 = new UserResponse(1L, "Juan Pérez", "juan.perez@example.com", roles);
        UserResponse userResponse2 = new UserResponse(2L, "Ana Gómez", "ana.gomez@example.com", roles);
        when(userMapper.toDto(user1)).thenReturn(userResponse1);
        when(userMapper.toDto(user2)).thenReturn(userResponse2);

        List<UserResponse> userResponses = userService.getAllUsers();

        assertNotNull(userResponses);
        assertEquals(2, userResponses.size());
        assertEquals(userResponse1, userResponses.get(0));
        assertEquals(userResponse2, userResponses.get(1));

        verify(userRepository, times(1)).findAll();
        verify(userMapper, times(1)).toDto(user1);
        verify(userMapper, times(1)).toDto(user2);
    }

    @Test
    public void testGetUserById_UserFound() {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        User user = User.builder().id(1L).nombre("Juan Pérez").correo("juan.perez@example.com").roles(roles).build();
        UserResponse userResponse = new UserResponse(1L, "Juan Pérez", "juan.perez@example.com", roles);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(userResponse);

        UserResponse result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(userResponse, result);

        verify(userRepository, times(1)).findById(1L);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    public void testGetUserByIdUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFound.class, () -> userService.getUserById(1L));

        verify(userRepository, times(1)).findById(1L);
        verify(userMapper, times(0)).toDto(any());
    }

    @Test
    public void testCreateUser() {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        UserRequest userRequest = new UserRequest("Juan Pérez", "juan.perez@example.com", "password123", roles);
        User user = User.builder().id(1L).nombre("Juan Pérez").correo("juan.perez@example.com").roles(roles).build();
        UserResponse userResponse = new UserResponse(1L, "Juan Pérez", "juan.perez@example.com", roles);

        when(userMapper.toEntity(userRequest)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userResponse);

        UserResponse result = userService.createUser(userRequest);

        assertNotNull(result);
        assertEquals(userResponse, result);

        verify(userMapper, times(1)).toEntity(userRequest);
        verify(userRepository, times(1)).save(user);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    public void testUpdateUser() {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        UserRequest userRequest = new UserRequest("Juan Pérez Actualizado", "juan.perez.updated@example.com", "newpassword123", roles);

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        UserResponse userResponse = new UserResponse(1L, "Juan Pérez Actualizado", "juan.perez.updated@example.com", roles);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        when(userMapper.toDto(user)).thenReturn(userResponse);

        doNothing().when(userMapper).updateUserFromRequest(user, userRequest);

        when(userRepository.save(user)).thenReturn(user);

        UserResponse result = userService.updateUser(1L, userRequest);

        assertNotNull(result);

        assertEquals(userResponse, result);

        verify(userRepository, times(1)).findById(1L);
        verify(userMapper, times(1)).updateUserFromRequest(user, userRequest);
        verify(userRepository, times(1)).save(user);
        verify(userMapper, times(1)).toDto(user);
    }


    @Test
    public void testDeleteUser() {
        Set<UserRole> roles = new HashSet<>(Arrays.asList(UserRole.ADMIN, UserRole.CLIENTE));
        User user = User.builder().id(1L).nombre("Juan Pérez").correo("juan.perez@example.com").roles(roles).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(user);
        assertTrue(user.isDeleted(), "El usuario debería estar marcado como eliminado");
    }
}
