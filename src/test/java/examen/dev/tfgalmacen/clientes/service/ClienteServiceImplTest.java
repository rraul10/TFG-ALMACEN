package examen.dev.tfgalmacen.clientes.service;

import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.exceptions.ClienteNotFound;
import examen.dev.tfgalmacen.rest.clientes.mapper.ClienteMapper;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.repository.ClienteRepository;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteServiceImpl;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ClienteServiceImplTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClienteMapper clienteMapper;

    @InjectMocks
    private ClienteServiceImpl clienteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
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
        when(clienteMapper.toResponse(cliente1)).thenReturn(new ClienteResponse(1L, 1L, "12345678A", "foto1.jpg", "Calle A"));
        when(clienteMapper.toResponse(cliente2)).thenReturn(new ClienteResponse(2L, 2L, "98765432B", "foto2.jpg", "Calle B"));

        List<ClienteResponse> response = clienteService.getAllClientes();

        assertEquals(2, response.size());
        assertEquals("12345678A", response.get(0).getDni());
        assertEquals("98765432B", response.get(1).getDni());
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
        when(clienteMapper.toResponse(cliente)).thenReturn(new ClienteResponse(1L, 1L, "12345678A", "foto1.jpg", "Calle A"));

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

        User user = new User(
                1L,
                "user1",
                "correo@dominio.com",
                "password",
                Set.of(UserRole.CLIENTE),
                LocalDateTime.now(),
                LocalDateTime.now(),
                false
        );

        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setDni("12345678A");
        cliente.setFotoDni("foto1.jpg");
        cliente.setDireccionEnvio("Calle A");

        ClienteResponse responseMock = new ClienteResponse(1L, 1L, "12345678A", "foto1.jpg", "Calle A");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(clienteMapper.toEntity(request, user)).thenReturn(cliente);
        when(clienteRepository.save(cliente)).thenReturn(cliente);
        when(clienteMapper.toResponse(cliente)).thenReturn(responseMock);

        ClienteResponse response = clienteService.createCliente(request);

        assertEquals("12345678A", response.getDni());
        assertEquals("foto1.jpg", response.getFotoDni());
        assertEquals("Calle A", response.getDireccionEnvio());

        verify(userRepository).findById(1L);
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

        Cliente clienteActualizado = new Cliente();
        clienteActualizado.setId(1L);
        clienteActualizado.setDni("87654321B");
        clienteActualizado.setFotoDni("foto2.jpg");
        clienteActualizado.setDireccionEnvio("Calle B");

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(clienteExistente));

        when(clienteRepository.save(clienteExistente)).thenReturn(clienteActualizado);

        when(clienteMapper.toResponse(clienteActualizado)).thenReturn(new ClienteResponse(1L, 1L, "87654321B", "foto2.jpg", "Calle B"));

        ClienteResponse response = clienteService.updateCliente(1L, request);

        assertNotNull(response);

        assertEquals("87654321B", response.getDni());
        assertEquals("foto2.jpg", response.getFotoDni());
        assertEquals("Calle B", response.getDireccionEnvio());

        verify(clienteRepository).save(clienteExistente);
    }

    @Test
    void updateClienteNotFound() {
        ClienteRequest request = new ClienteRequest(1L, "87654321B", "foto2.jpg", "Calle B");

        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ClienteNotFound.class, () -> clienteService.updateCliente(1L, request));
        verify(clienteRepository).findById(1L);
    }

    @Test
    void deleteCliente() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setDni("12345678A");
        cliente.setFotoDni("foto1.jpg");
        cliente.setDireccionEnvio("Calle A");

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        clienteService.deleteCliente(1L);

        assertTrue(cliente.isDeleted());
        verify(clienteRepository).save(cliente);
    }

    @Test
    void deleteClienteNotFound() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ClienteNotFound.class, () -> clienteService.deleteCliente(1L));
        verify(clienteRepository).findById(1L);
    }
}