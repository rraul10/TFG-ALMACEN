package examen.dev.tfgalmacen.rest.clientes.mapper;

import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.BeforeEach;


public class ClienteMapperTest {

    private ClienteMapper clienteMapper;

    @BeforeEach
    public void setUp() {
        clienteMapper = new ClienteMapper();
    }

    @Test
    public void testToEntity() {
        ClienteRequest clienteRequest = ClienteRequest.builder()
                .dni("12345678A")
                .fotoDni("foto_dni_path")
                .direccionEnvio("Calle Falsa 123")
                .build();

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .build();

        Cliente cliente = clienteMapper.toEntity(clienteRequest, user);

        assertNotNull(cliente, "El cliente no debería ser null");
        assertEquals(clienteRequest.getDni(), cliente.getDni(), "El DNI debería coincidir");
        assertEquals(clienteRequest.getFotoDni(), cliente.getFotoDni(), "La foto del DNI debería coincidir");
        assertEquals(clienteRequest.getDireccionEnvio(), cliente.getDireccionEnvio(), "La dirección de envío debería coincidir");
        assertEquals(user.getId(), cliente.getUser().getId(), "El ID del usuario debería coincidir");
    }

    @Test
    public void testToResponse() {
        Cliente cliente = Cliente.builder()
                .id(1L)
                .dni("12345678A")
                .fotoDni("foto_dni_path")
                .direccionEnvio("Calle Falsa 123")
                .user(User.builder().id(1L).build())
                .build();

        ClienteResponse clienteResponse = clienteMapper.toResponse(cliente);

        assertNotNull(clienteResponse, "El clienteResponse no debería ser null");
        assertEquals(cliente.getId(), clienteResponse.getId(), "El ID del cliente debería coincidir");
        assertEquals(cliente.getUser().getId(), clienteResponse.getUserId(), "El ID del usuario debería coincidir");
        assertEquals(cliente.getDni(), clienteResponse.getDni(), "El DNI debería coincidir");
        assertEquals(cliente.getFotoDni(), clienteResponse.getFotoDni(), "La foto del DNI debería coincidir");
        assertEquals(cliente.getDireccionEnvio(), clienteResponse.getDireccionEnvio(), "La dirección de envío debería coincidir");
    }
}
