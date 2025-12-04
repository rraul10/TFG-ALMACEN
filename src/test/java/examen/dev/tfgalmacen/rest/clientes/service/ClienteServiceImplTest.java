package examen.dev.tfgalmacen.rest.clientes.service;

import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.exceptions.ClienteNotFound;
import examen.dev.tfgalmacen.rest.clientes.mapper.ClienteMapper;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import examen.dev.tfgalmacen.storage.service.StorageService;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClienteServiceImplTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClienteMapper clienteMapper;

    @Mock
    private EmailService emailService;

    @Mock
    private StorageService storageService;

    @InjectMocks
    private ClienteServiceImpl clienteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private ClienteResponse buildClienteResponse(Long id, Long userId, String dni, String fotoDni, String direccionEnvio) {
        ClienteResponse cliente = new ClienteResponse();
        cliente.setId(id);
        cliente.setUserId(userId);
        cliente.setDni(dni);
        cliente.setFotoDni(fotoDni);
        cliente.setDireccionEnvio(direccionEnvio);
        return cliente;
    }

    @Test
    void getAllClientes() {
        Cliente cliente1 = new Cliente();
        cliente1.setId(1L);
        cliente1.setDni("12345678A");
        cliente1.setFotoDni("foto1.jpg");
        cliente1.setDireccionEnvio("Calle A");

        Cliente cliente2 = new Cliente();
        cliente2.setId(2L);
        cliente2.setDni("98765432B");
        cliente2.setFotoDni("foto2.jpg");
        cliente2.setDireccionEnvio("Calle B");

        List<Cliente> clientes = List.of(cliente1, cliente2);

        when(clienteRepository.findAll()).thenReturn(clientes);
        when(clienteMapper.toResponse(cliente1)).thenReturn(buildClienteResponse(1L, 1L, "12345678A", "foto1.jpg", "Calle A"));
        when(clienteMapper.toResponse(cliente2)).thenReturn(buildClienteResponse(2L, 2L, "98765432B", "foto2.jpg", "Calle B"));

        List<ClienteResponse> response = clienteService.getAllClientes();

        assertEquals(2, response.size());
        verify(clienteRepository).findAll();
    }

    @Test
    void getAllClientes_EmptyList() {
        when(clienteRepository.findAll()).thenReturn(List.of());

        List<ClienteResponse> response = clienteService.getAllClientes();

        assertTrue(response.isEmpty());
        verify(clienteRepository).findAll();
    }

    @Test
    void getById() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setDni("12345678A");
        cliente.setFotoDni("foto1.jpg");
        cliente.setDireccionEnvio("Calle A");

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteMapper.toResponse(cliente)).thenReturn(
                buildClienteResponse(1L, 1L, "12345678A", "foto1.jpg", "Calle A")
        );

        ClienteResponse response = clienteService.getById(1L);

        assertNotNull(response);
        assertEquals("12345678A", response.getDni());
        verify(clienteRepository).findById(1L);
    }

    @Test
    void getByIdClientNotFound() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ClienteNotFound.class, () -> clienteService.getById(1L));
        verify(clienteRepository).findById(1L);
    }

    @Test
    void createCliente() {
        ClienteRequest request = new ClienteRequest(1L, "12345678A", "foto1.jpg", "Calle A");

        User user = User.builder()
                .id(1L)
                .nombre("user1")
                .correo("correo@dominio.com")
                .password("password")
                .roles(Set.of(UserRole.CLIENTE))
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();

        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setDni("12345678A");
        cliente.setFotoDni("foto1.jpg");
        cliente.setDireccionEnvio("Calle A");

        ClienteResponse responseMock = buildClienteResponse(1L, 1L, "12345678A", "foto1.jpg", "Calle A");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(clienteMapper.toEntity(request, user)).thenReturn(cliente);
        when(clienteRepository.save(cliente)).thenReturn(cliente);
        when(clienteMapper.toResponse(cliente)).thenReturn(responseMock);

        ClienteResponse response = clienteService.createCliente(request);

        assertEquals("12345678A", response.getDni());
        verify(clienteRepository).save(cliente);
    }

    @Test
    void createClienteUserNotFound() {
        ClienteRequest request = new ClienteRequest(1L, "12345678A", "foto1.jpg", "Calle A");

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ClienteNotFound.class, () -> clienteService.createCliente(request));
        verify(userRepository).findById(1L);
    }

    @Test
    void updateCliente() {
        ClienteRequest request = new ClienteRequest(1L, "87654321B", "foto2.jpg", "Calle B");

        Cliente clienteExistente = new Cliente();
        clienteExistente.setId(1L);
        clienteExistente.setDni("12345678A");
        clienteExistente.setFotoDni("foto1.jpg");
        clienteExistente.setDireccionEnvio("Calle A");

        User user = new User();
        user.setCorreo("usuario@example.com");
        user.setNombre("Usuario Nombre");
        clienteExistente.setUser(user);

        Cliente clienteActualizado = new Cliente();
        clienteActualizado.setId(1L);
        clienteActualizado.setDni("87654321B");
        clienteActualizado.setFotoDni("foto2.jpg");
        clienteActualizado.setDireccionEnvio("Calle B");
        clienteActualizado.setUser(user);

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(clienteExistente));
        when(clienteRepository.save(clienteExistente)).thenReturn(clienteActualizado);
        when(clienteMapper.toResponse(clienteActualizado)).thenReturn(buildClienteResponse(1L, 1L, "87654321B", "foto2.jpg", "Calle B"));

        ClienteResponse response = clienteService.updateCliente(1L, request);

        assertEquals("87654321B", response.getDni());
        verify(emailService).notificarActualizacionPerfil("usuario@example.com", "Usuario Nombre");
    }

    @Test
    void updateClienteNotFound() {
        ClienteRequest request = new ClienteRequest(1L, "87654321B", "foto2.jpg", "Calle B");

        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ClienteNotFound.class, () -> clienteService.updateCliente(1L, request));
    }

    @Test
    void deleteCliente() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        clienteService.deleteCliente(1L);

        assertTrue(cliente.isDeleted());
        verify(clienteRepository).save(cliente);
    }

    @Test
    void deleteClienteNotFound() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ClienteNotFound.class, () -> clienteService.deleteCliente(1L));
    }

    @Test
    void testGetClienteEntityById_Existente() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        Cliente result = clienteService.getClienteEntityById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void testGetClienteEntityById_NoExistente() {
        when(clienteRepository.findById(2L)).thenReturn(Optional.empty());

        ClienteNotFound ex = assertThrows(
                ClienteNotFound.class,
                () -> clienteService.getClienteEntityById(2L)
        );

        assertEquals("Cliente no encontrado", ex.getMessage());
    }
}
