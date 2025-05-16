package examen.dev.tfgalmacen.rest.clientes.controller;

import examen.dev.tfgalmacen.rest.clientes.controller.ClienteController;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteRequest;
import examen.dev.tfgalmacen.rest.clientes.dto.ClienteResponse;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClienteControllerTest {

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private ClienteController clienteController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testGetAllClientes() {
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
    void testGetClienteById() {
        ClienteResponse cliente = new ClienteResponse(1L, 2L, "12345678A", "dni.jpg", "Calle A");
        when(clienteService.getById(1L)).thenReturn(cliente);

        ResponseEntity<ClienteResponse> response = clienteController.getClienteById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("12345678A", response.getBody().getDni());
        verify(clienteService).getById(1L);
    }


    @Test
    void testGetClienteByIdNotFound() {
        when(clienteService.getById(99L)).thenThrow(new NoSuchElementException("Cliente no encontrado"));

        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            clienteController.getClienteById(99L);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteService).getById(99L);
    }


    @Test
    void testCreateCliente() {
        ClienteRequest request = new ClienteRequest(null, "12345678Z", "foto.jpg", "Calle Nueva");
        ClienteResponse responseMock = new ClienteResponse(2L, 3L, "12345678Z", "foto.jpg", "Calle Nueva"); // 3L = userId

        when(clienteService.createCliente(request)).thenReturn(responseMock);

        ResponseEntity<ClienteResponse> response = clienteController.createCliente(request);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("12345678Z", response.getBody().getDni());
        verify(clienteService).createCliente(request);
    }


    @Test
    void testCreateClienteInvalidRequest() {
        ClienteRequest request = new ClienteRequest(null, "", "", ""); // Campos inválidos

        when(clienteService.createCliente(request)).thenThrow(new IllegalArgumentException("Datos inválidos del cliente"));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            clienteController.createCliente(request);
        });

        assertEquals("Datos inválidos del cliente", exception.getMessage());
        verify(clienteService).createCliente(request);
    }


    @Test
    void testUpdateCliente() {
        ClienteRequest request = new ClienteRequest(null, "87654321B", "foto2.jpg", "Calle B");
        ClienteResponse responseMock = new ClienteResponse(1L, 4L, "87654321B", "foto2.jpg", "Calle B"); // 4L es userId válido

        when(clienteService.updateCliente(1L, request)).thenReturn(responseMock);

        ResponseEntity<ClienteResponse> response = clienteController.updateCliente(1L, request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("87654321B", response.getBody().getDni());
        verify(clienteService).updateCliente(1L, request);
    }

    @Test
    void testUpdateClienteNotFound() {
        ClienteRequest request = new ClienteRequest(null, "00000000X", "foto3.jpg", "Calle Fantasma");

        when(clienteService.updateCliente(999L, request)).thenThrow(new NoSuchElementException("Cliente no encontrado"));

        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            clienteController.updateCliente(999L, request);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteService).updateCliente(999L, request);
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
}
