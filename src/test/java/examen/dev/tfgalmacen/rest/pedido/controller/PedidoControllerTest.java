package examen.dev.tfgalmacen.rest.pedido.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.repository.PedidoRepository;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoService;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.websockets.notifications.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PedidoControllerTest {

    @Mock
    private PedidoService pedidoService;

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private EmailService emailService;


    @Mock
    private TicketService ticketService;

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

    /*
    @Test
    @WithMockUser(username = "juan.perez@example.com")
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
     */

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

    @Test
    void testActualizarEstado_ok() throws Exception {
        Long pedidoId = 1L;
        String estado = "ENVIADO";

        PedidoResponse responseMock = PedidoResponse.builder()
                .id(pedidoId)
                .clienteId(10L)
                .build();

        when(pedidoService.actualizarEstado(pedidoId, estado)).thenReturn(responseMock);

        mockMvc.perform(put("/api/pedidos/estado/{id}", pedidoId)
                        .param("estado", estado)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(pedidoId))
                .andExpect(jsonPath("$.clienteId").value(10));

        verify(pedidoService, times(1)).actualizarEstado(pedidoId, estado);
    }

    @Test
    void testConfirmarPago_ok() throws Exception {
        Long pedidoId = 1L;
        Pedido pedidoMock = mock(Pedido.class);
        ByteArrayOutputStream pdfMock = new ByteArrayOutputStream();
        pdfMock.write("fakePDF".getBytes());

        when(pedidoRepository.findByIdWithLineasVentaAndProducto(pedidoId))
                .thenReturn(Optional.of(pedidoMock));
        when(ticketService.generarTicketPDF(pedidoMock)).thenReturn(pdfMock);

        when(pedidoMock.getCliente()).thenReturn(mock(examen.dev.tfgalmacen.rest.clientes.models.Cliente.class));
        when(pedidoMock.getCliente().getUser()).thenReturn(mock(examen.dev.tfgalmacen.rest.users.models.User.class));
        when(pedidoMock.getCliente().getUser().getCorreo()).thenReturn("test@example.com");

        doNothing().when(emailService).enviarTicketPorEmail(eq("test@example.com"), any());

        mockMvc.perform(post("/api/pedidos/{id}/confirmar-pago", pedidoId))
                .andExpect(status().isOk())
                .andExpect(content().string("PDF enviado"));

        verify(pedidoRepository).findByIdWithLineasVentaAndProducto(pedidoId);
        verify(ticketService).generarTicketPDF(pedidoMock);
        verify(emailService).enviarTicketPorEmail(eq("test@example.com"), any());
    }

    @Test
    void testConfirmarPago_error() throws Exception {
        Long pedidoId = 1L;

        when(pedidoRepository.findByIdWithLineasVentaAndProducto(pedidoId))
                .thenThrow(new RuntimeException("Pedido no encontrado"));

        mockMvc.perform(post("/api/pedidos/{id}/confirmar-pago", pedidoId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Ocurrió un error al enviar el ticket")));

        verify(pedidoRepository).findByIdWithLineasVentaAndProducto(pedidoId);
        verifyNoInteractions(ticketService);
        verifyNoInteractions(emailService);
    }
}
