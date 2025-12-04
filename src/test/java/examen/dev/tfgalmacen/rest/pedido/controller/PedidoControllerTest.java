package examen.dev.tfgalmacen.rest.pedido.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PedidoControllerTest {

    @Mock
    private PedidoService pedidoService;

    @InjectMocks
    private PedidoController pedidoController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(pedidoController).build();
        objectMapper = new ObjectMapper();
    }

    private PedidoRequest mockRequest() {
        PedidoRequest request = new PedidoRequest();
        request.setClienteId(1L);
        request.setLineasVenta(List.of(new LineaVentaDTO(1L, null, 2, null)));
        return request;
    }

    private PedidoResponse mockResponse() {
        PedidoResponse response = new PedidoResponse();
        response.setId(1L);
        response.setClienteId(1L);
        response.setEstado(EstadoPedido.PENDIENTE);
        response.setFecha(LocalDateTime.now());
        response.setLineasVenta(List.of(new LineaVentaDTO(1L, null, 2, null)));
        return response;
    }

    @Test
    void getAll() throws Exception {
        when(pedidoService.getAll()).thenReturn(List.of(mockResponse()));

        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));

        verify(pedidoService).getAll();
    }

    @Test
    void getById() throws Exception {
        when(pedidoService.getById(1L)).thenReturn(mockResponse());

        mockMvc.perform(get("/api/pedidos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clienteId").value(1L));

        verify(pedidoService).getById(1L);
    }

    @Test
    void create() throws Exception {
        PedidoRequest request = mockRequest();
        PedidoResponse response = mockResponse();

        when(pedidoService.create(any(PedidoRequest.class), eq(1L))).thenReturn(response);
        when(pedidoService.createStripeCheckout(response)).thenReturn("http://stripe-session-url");
        when(pedidoService.getUserIdByEmail(anyString())).thenReturn(1L);

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.pedidoId").value("1"))
                .andExpect(jsonPath("$.url").value("http://stripe-session-url"));

        verify(pedidoService).create(any(PedidoRequest.class), eq(1L));
        verify(pedidoService).createStripeCheckout(any(PedidoResponse.class));
    }



    @Test
    void update() throws Exception {
        PedidoRequest request = mockRequest();
        PedidoResponse response = mockResponse();

        when(pedidoService.update(eq(1L), any(PedidoRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/pedidos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));

        verify(pedidoService).update(eq(1L), any(PedidoRequest.class));
    }

    @Test
    void deletePedido() throws Exception {
        doNothing().when(pedidoService).delete(1L);

        mockMvc.perform(delete("/api/pedidos/1"))
                .andExpect(status().isNoContent());

        verify(pedidoService).delete(1L);
    }
}
