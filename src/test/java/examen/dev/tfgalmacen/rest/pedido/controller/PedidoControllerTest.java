package examen.dev.tfgalmacen.rest.pedido.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.rest.pedido.controller.PedidoController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

    private PedidoResponse getMockPedidoResponse() {
        PedidoResponse response = new PedidoResponse();
        response.setId(1L);
        response.setClienteId(1L);
        response.setEstado(EstadoPedido.PENDIENTE);
        response.setFecha(LocalDateTime.now());
        response.setLineasVenta(List.of(new LineaVentaDTO(1L, 2)));
        return response;
    }

    private PedidoRequest getMockPedidoRequest() {
        PedidoRequest request = new PedidoRequest();
        request.setClienteId(1L);
        request.setLineasVenta(List.of(new LineaVentaDTO(1L, 2)));
        return request;
    }

    @Test
    void getAll() throws Exception {
        when(pedidoService.getAll()).thenReturn(List.of(getMockPedidoResponse()));

        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L));

        verify(pedidoService).getAll();
    }

    @Test
    void getById() throws Exception {
        when(pedidoService.getById(1L)).thenReturn(getMockPedidoResponse());

        mockMvc.perform(get("/api/pedidos/1"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.clienteId").value(1L));

        verify(pedidoService).getById(1L);
    }

    @Test
    void create() throws Exception {
        PedidoRequest request = getMockPedidoRequest();
        PedidoResponse response = getMockPedidoResponse();

        when(pedidoService.create(any(PedidoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L));

        verify(pedidoService).create(any(PedidoRequest.class));
    }


    @Test
    void update() throws Exception {
        PedidoRequest request = getMockPedidoRequest();
        PedidoResponse response = getMockPedidoResponse();

        when(pedidoService.update(eq(1L), any(PedidoRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/pedidos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.estado").value("PENDIENTE"));

        verify(pedidoService).update(eq(1L), any(PedidoRequest.class));
    }

    @Test
    void delete() throws Exception {
        doNothing().when(pedidoService).delete(1L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/pedidos/1"))
                .andExpect(status().isNoContent())
                .andDo(result -> System.out.println("Response: " + result.getResponse().getContentAsString()));


        verify(pedidoService).delete(1L);
    }
}
