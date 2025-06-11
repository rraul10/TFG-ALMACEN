package examen.dev.tfgalmacen.rest.clientes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.CompraRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


class ClienteControllerTest {

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private ClienteController clienteController;

    @Mock
    private PedidoService pedidoService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(clienteController).build();
    }

    @Test
    void testGetAllClientes() throws Exception {
        List<ClienteResponse> clientes = List.of(
                new ClienteResponse(1L, 2L, "12345678A", "dni.jpg", "Calle A")
        );

        when(clienteService.getAllClientes()).thenReturn(clientes);

        ResponseEntity<List<ClienteResponse>> response = clienteController.getAllClientes();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(clienteService).getAllClientes();
    }

    @Test
    void testGetClienteById() throws Exception {
        ClienteResponse cliente = new ClienteResponse(1L, 2L, "12345678A", "dni.jpg", "Calle A");
        when(clienteService.getById(1L)).thenReturn(cliente);

        ResponseEntity<ClienteResponse> response = clienteController.getClienteById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("12345678A", response.getBody().getDni());
        verify(clienteService).getById(1L);
    }

    @Test
    void testGetClienteByIdNotFound() throws Exception {
        when(clienteService.getById(99L)).thenThrow(new NoSuchElementException("Cliente no encontrado"));

        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            clienteController.getClienteById(99L);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteService).getById(99L);
    }

    @Test
    void testCreateCliente() throws Exception {
        ClienteRequest request = new ClienteRequest(null, "12345678Z", "foto.jpg", "Calle Nueva");
        ClienteResponse responseMock = new ClienteResponse(2L, 3L, "12345678Z", "foto.jpg", "Calle Nueva"); // 3L = userId

        MockMultipartFile clienteFile = new MockMultipartFile(
                "cliente",
                "cliente",
                "application/json",
                new ObjectMapper().writeValueAsBytes(request)
        );

        MockMultipartFile fotoDniFile = new MockMultipartFile(
                "fotoDni",
                "fotoDni.jpg",
                "image/jpeg",
                new byte[0]
        );

        when(clienteService.createCliente(any(ClienteRequest.class))).thenReturn(responseMock);

        mockMvc.perform(multipart("/api/clientes/create")
                        .file(clienteFile)
                        .file(fotoDniFile))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dni").value("12345678Z"));

        verify(clienteService).createCliente(any(ClienteRequest.class));
    }

    @Test
    void testUpdateClienteOk() throws Exception {
        ClienteRequest request = new ClienteRequest(4L, "87654321B", "foto2.jpg", "Calle B");
        ClienteResponse responseMock = new ClienteResponse(1L, 4L, "87654321B", "foto2.jpg", "Calle B");

        MockMultipartFile clienteFile = new MockMultipartFile(
                "cliente", "cliente.json", "application/json",
                new ObjectMapper().writeValueAsBytes(request)
        );

        MockMultipartFile fotoDniFile = new MockMultipartFile(
                "fotoDni", "foto2Dni.jpg", "image/jpeg", new byte[0]
        );

        when(clienteService.updateCliente(eq(1L), any(ClienteRequest.class))).thenReturn(responseMock);

        mockMvc.perform(multipart("/api/clientes/{id}", 1L)
                        .file(clienteFile)
                        .file(fotoDniFile)
                        .with(req -> {
                            req.setMethod("PUT");
                            return req;
                        })
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dni").value("87654321B"))
                .andExpect(jsonPath("$.direccionEnvio").value("Calle B"));

        verify(clienteService, times(1)).updateCliente(eq(1L), any(ClienteRequest.class));
    }



    @Test
    void testDeleteCliente() {
        doNothing().when(clienteService).deleteCliente(1L);

        ResponseEntity<Void> response = clienteController.deleteCliente(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(clienteService).deleteCliente(1L);
    }

    @Test
    void testDeleteClienteNotFound() {
        doThrow(new NoSuchElementException("Cliente no encontrado")).when(clienteService).deleteCliente(100L);

        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            clienteController.deleteCliente(100L);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteService).deleteCliente(100L);
    }

    @Test
    void testComprarProducto() throws Exception {
        Long clienteId = 1L;
        CompraRequest request = new CompraRequest("Producto de prueba", 2, clienteId);

        PedidoResponse pedidoResponseMock = PedidoResponse.builder()
                .id(1L)
                .clienteId(clienteId)
                .estado(EstadoPedido.PENDIENTE)
                .fecha(LocalDateTime.now())
                .lineasVenta(Collections.emptyList())
                .build();

        when(pedidoService.crearCompraDesdeNombreProducto(any(CompraRequest.class)))
                .thenReturn(pedidoResponseMock);

        String requestJson = new ObjectMapper().writeValueAsString(request);

        mockMvc.perform(post("/api/clientes/{id}/comprar", clienteId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.clienteId").value(clienteId))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andExpect(jsonPath("$.fecha").exists())
                .andExpect(jsonPath("$.lineasVenta").isArray())
                .andExpect(jsonPath("$.lineasVenta.length()").value(0));

        verify(pedidoService).crearCompraDesdeNombreProducto(any(CompraRequest.class));
    }


    @Test
    void testGetPedidosByCliente() throws Exception {
        Long clienteId = 1L;

        List<PedidoResponse> pedidosMock = Arrays.asList(
                PedidoResponse.builder()
                        .id(1L)
                        .clienteId(clienteId)
                        .estado(EstadoPedido.PENDIENTE)
                        .fecha(LocalDateTime.now())
                        .lineasVenta(Collections.emptyList())
                        .build(),
                PedidoResponse.builder()
                        .id(2L)
                        .clienteId(clienteId)
                        .estado(EstadoPedido.ENVIADO)
                        .fecha(LocalDateTime.now())
                        .lineasVenta(Collections.emptyList())
                        .build()
        );

        when(pedidoService.getPedidosByClienteId(clienteId)).thenReturn(pedidosMock);

        mockMvc.perform(get("/api/clientes/{id}/mispedidos", clienteId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].estado").value("PENDIENTE"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].estado").value("ENVIADO"));

        verify(pedidoService).getPedidosByClienteId(clienteId);
    }

}
