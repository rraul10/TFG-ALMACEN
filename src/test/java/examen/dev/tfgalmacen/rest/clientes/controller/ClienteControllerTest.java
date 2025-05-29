package examen.dev.tfgalmacen.rest.clientes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


class ClienteControllerTest {

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private ClienteController clienteController;

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
    void testCreateClienteInvalidRequest() throws Exception {
        // Crear el objeto de solicitud con datos inválidos
        ClienteRequest request = new ClienteRequest(null, "", "", ""); // userId null y campos vacíos

        // Serializar el JSON del cliente
        MockMultipartFile clienteFile = new MockMultipartFile(
                "cliente", // nombre de la parte
                "cliente.json",
                "application/json",
                new ObjectMapper().writeValueAsBytes(request)
        );

        // Crear archivo de foto vacío (no importa para este test)
        MockMultipartFile fotoDniFile = new MockMultipartFile(
                "fotoDni",
                "default.jpg",
                "image/jpeg",
                new byte[0]
        );

        // Simular que el servicio lanza una excepción por datos inválidos
        when(clienteService.createCliente(any(ClienteRequest.class)))
                .thenThrow(new IllegalArgumentException("Datos inválidos del cliente"));

        // Ejecutar la petición y verificar el error 400
        mockMvc.perform(multipart("/api/clientes/create")
                        .file(clienteFile)
                        .file(fotoDniFile))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Datos inválidos del cliente"));

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
    @WithMockUser(username = "cliente", roles = {"CLIENTE"})
    void testGetPedidosByClienteId_Autorizado() throws Exception {
        Long clienteId = 1L;

        mockMvc.perform(get("/api/clientes/" + clienteId + "/mispedidos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "otro", roles = {"OTRO"})
    void testGetPedidosByClienteId_NoAutorizado() throws Exception {
        mockMvc.perform(get("/1/mispedidos"))
                .andExpect(status().isForbidden());
    }
}
