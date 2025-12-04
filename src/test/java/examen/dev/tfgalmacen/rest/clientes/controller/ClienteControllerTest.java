package examen.dev.tfgalmacen.rest.clientes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.CompraRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.storage.service.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ClienteControllerTest {

    @Mock
    private ClienteService clienteService;

    @Mock
    private PedidoService pedidoService;

    @Mock
    private StorageService storageService;

    @InjectMocks
    private ClienteController clienteController;

    private MockMvc mockMvc;
    private ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(clienteController).build();
    }

    private ClienteResponse buildClienteResponse(
            Long id, Long userId, String dni, String fotoDni, String direccionEnvio
    ) {
        ClienteResponse cliente = new ClienteResponse();
        cliente.setId(id);
        cliente.setUserId(userId);
        cliente.setDni(dni);
        cliente.setFotoDni(fotoDni);
        cliente.setDireccionEnvio(direccionEnvio);
        // otros campos opcionales se pueden dejar como null
        return cliente;
    }

    @Test
    void testGetAllClientes() {
        List<ClienteResponse> clientes = List.of(
                buildClienteResponse(1L, 2L, "12345678A", "dni.jpg", "Calle A")
        );

        when(clienteService.getAllClientes()).thenReturn(clientes);

        var response = clienteController.getAllClientes();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(clienteService).getAllClientes();
    }

    @Test
    void testGetClienteById() {
        ClienteResponse cliente = buildClienteResponse(1L, 2L, "12345678A", "dni.jpg", "Calle A");

        when(clienteService.getById(1L)).thenReturn(cliente);

        var response = clienteController.getClienteById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("12345678A", response.getBody().getDni());
        verify(clienteService).getById(1L);
    }

    @Test
    void testGetClienteByIdNotFound() {
        when(clienteService.getById(99L)).thenThrow(new NoSuchElementException("Cliente no encontrado"));

        var exception = assertThrows(NoSuchElementException.class,
                () -> clienteController.getClienteById(99L));

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteService).getById(99L);
    }

    @Test
    void testCreateCliente() throws Exception {

        ClienteRequest request = new ClienteRequest(null, "12345678Z", null, "Calle Nueva");
        ClienteResponse responseMock = buildClienteResponse(2L, 3L, "12345678Z", "imagenGuardada.jpg", "Calle Nueva");

        MockMultipartFile clienteFile = new MockMultipartFile(
                "cliente",
                "cliente",
                "application/json",
                mapper.writeValueAsBytes(request)
        );

        MockMultipartFile fotoDniFile = new MockMultipartFile(
                "fotoDni",
                "dni.jpg",
                "image/jpeg",
                "testdata".getBytes()
        );

        when(storageService.store(any())).thenReturn("imagenGuardada.jpg");
        when(clienteService.createCliente(any())).thenReturn(responseMock);

        mockMvc.perform(multipart("/api/clientes/create")
                        .file(clienteFile)
                        .file(fotoDniFile))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dni").value("12345678Z"))
                .andExpect(jsonPath("$.fotoDni").value("imagenGuardada.jpg"));

        verify(storageService).store(any());
        verify(clienteService).createCliente(any());
    }

    @Test
    void testUpdateClienteOk() throws Exception {

        ClienteRequest request = new ClienteRequest(4L, "87654321B", null, "Calle B");
        ClienteResponse responseMock = buildClienteResponse(1L, 4L, "87654321B", "fotoActualizada.jpg", "Calle B");

        MockMultipartFile clienteFile = new MockMultipartFile(
                "cliente", "cliente.json", "application/json",
                mapper.writeValueAsBytes(request)
        );

        MockMultipartFile fotoDniFile = new MockMultipartFile(
                "fotoDni", "dniNuevo.jpg", "image/jpeg", "x".getBytes()
        );

        when(storageService.store(any())).thenReturn("fotoActualizada.jpg");
        when(clienteService.updateCliente(eq(1L), any())).thenReturn(responseMock);

        mockMvc.perform(multipart("/api/clientes/{id}", 1L)
                        .file(clienteFile)
                        .file(fotoDniFile)
                        .with(req -> { req.setMethod("PUT"); return req; }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dni").value("87654321B"))
                .andExpect(jsonPath("$.fotoDni").value("fotoActualizada.jpg"))
                .andExpect(jsonPath("$.direccionEnvio").value("Calle B"));

        verify(storageService).store(any());
        verify(clienteService).updateCliente(eq(1L), any());
    }

    @Test
    void testDeleteCliente() {
        doNothing().when(clienteService).deleteCliente(1L);

        var response = clienteController.deleteCliente(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(clienteService).deleteCliente(1L);
    }

    @Test
    void testDeleteClienteNotFound() {
        doThrow(new NoSuchElementException("Cliente no encontrado"))
                .when(clienteService).deleteCliente(100L);

        var ex = assertThrows(NoSuchElementException.class,
                () -> clienteController.deleteCliente(100L));

        assertEquals("Cliente no encontrado", ex.getMessage());
        verify(clienteService).deleteCliente(100L);
    }

    @Test
    void testComprarProducto() throws Exception {
        Long clienteId = 1L;

        CompraRequest request = new CompraRequest("Producto Prueba", 2, null, null);

        PedidoResponse pedidoMock = PedidoResponse.builder()
                .id(1L)
                .clienteId(clienteId)
                .estado(EstadoPedido.PENDIENTE)
                .fecha(LocalDateTime.now())
                .lineasVenta(Collections.emptyList())
                .build();

        when(pedidoService.crearCompraDesdeNombreProducto(any())).thenReturn(pedidoMock);

        mockMvc.perform(post("/api/clientes/{id}/comprar", clienteId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clienteId").value(clienteId))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));

        verify(pedidoService).crearCompraDesdeNombreProducto(any());
    }

    @Test
    void testGetPedidosByCliente() throws Exception {
        Long clienteId = 1L;

        List<PedidoResponse> pedidos = Arrays.asList(
                PedidoResponse.builder()
                        .id(1L)
                        .clienteId(clienteId)
                        .estado(EstadoPedido.PENDIENTE)
                        .fecha(LocalDateTime.now())
                        .lineasVenta(List.of())
                        .build(),
                PedidoResponse.builder()
                        .id(2L)
                        .clienteId(clienteId)
                        .estado(EstadoPedido.ENVIADO)
                        .fecha(LocalDateTime.now())
                        .lineasVenta(List.of())
                        .build()
        );

        when(pedidoService.getPedidosByClienteId(clienteId)).thenReturn(pedidos);

        mockMvc.perform(get("/api/clientes/{id}/mispedidos", clienteId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].estado").value("PENDIENTE"))
                .andExpect(jsonPath("$[1].estado").value("ENVIADO"));

        verify(pedidoService).getPedidosByClienteId(clienteId);
    }
}
