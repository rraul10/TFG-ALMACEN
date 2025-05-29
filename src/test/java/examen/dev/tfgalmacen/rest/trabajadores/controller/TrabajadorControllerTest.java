package examen.dev.tfgalmacen.rest.trabajadores.controller;

import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.service.PedidoServiceImpl;
import examen.dev.tfgalmacen.rest.trabajadores.controller.TrabajadorController;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.rest.trabajadores.exceptions.TrabajadorNotFoundException;
import examen.dev.tfgalmacen.rest.trabajadores.service.TrabajadorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TrabajadorControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TrabajadorService trabajadorService;

    @Mock
    private PedidoServiceImpl pedidoService;

    @InjectMocks
    private TrabajadorController trabajadorController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(trabajadorController).build();
    }

    @Test
    void testGetAll() throws Exception {
        TrabajadorResponse trabajadorResponse = TrabajadorResponse.builder()
                .id(1L)
                .nombre("Juan")
                .correo("juan@example.com")
                .numeroSeguridadSocial("12345")
                .build();

        given(trabajadorService.getAll()).willReturn(List.of(trabajadorResponse));

        mockMvc.perform(get("/api/trabajadores")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Juan"));
    }

    @Test
    void testGetAll_NotFound() throws Exception {
        given(trabajadorService.getAll()).willThrow(new TrabajadorNotFoundException("No se encontraron trabajadores"));

        mockMvc.perform(get("/api/trabajadores")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().json("[]"));
    }

    @Test
    void testGetById() throws Exception {
        TrabajadorResponse trabajadorResponse = TrabajadorResponse.builder()
                .id(1L)
                .nombre("Juan")
                .correo("juan@example.com")
                .numeroSeguridadSocial("12345")
                .build();

        given(trabajadorService.getTrabajadorById(1L)).willReturn(trabajadorResponse);

        mockMvc.perform(get("/api/trabajadores/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    @Test
    void testGetByIdNotFound() throws Exception {
        given(trabajadorService.getTrabajadorById(1L)).willThrow(new TrabajadorNotFoundException("No existe"));

        mockMvc.perform(get("/api/trabajadores/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreate() throws Exception {
        TrabajadorResponse trabajadorResponse = TrabajadorResponse.builder()
                .id(1L)
                .nombre("Juan")
                .correo("juan@example.com")
                .numeroSeguridadSocial("12345")
                .build();

        when(trabajadorService.crearTrabajador(any(TrabajadorRequest.class))).thenReturn(trabajadorResponse);

        mockMvc.perform(post("/api/trabajadores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"numeroSeguridadSocial\":\"12345\",\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    @Test
    void testUpdate() throws Exception {
        TrabajadorRequest request = new TrabajadorRequest();
        request.setNumeroSeguridadSocial("12345");

        TrabajadorResponse trabajadorResponse = TrabajadorResponse.builder()
                .id(1L)
                .nombre("Juan")
                .correo("juan@example.com")
                .numeroSeguridadSocial("12345")
                .build();

        when(trabajadorService.updateTrabajador(1L, request)).thenReturn(trabajadorResponse);

        mockMvc.perform(put("/api/trabajadores/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"numeroSeguridadSocial\":\"12345\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    @Test
    void testUpdateNotFound() throws Exception {
        TrabajadorRequest request = new TrabajadorRequest();
        request.setNumeroSeguridadSocial("99999");

        given(trabajadorService.updateTrabajador(any(Long.class), any(TrabajadorRequest.class)))
                .willThrow(new TrabajadorNotFoundException("Trabajador no encontrado"));

        mockMvc.perform(put("/api/trabajadores/{id}", 99L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"numeroSeguridadSocial\":\"99999\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDelete() throws Exception {
        willDoNothing().given(trabajadorService).deleteTrabajador(1L);

        mockMvc.perform(delete("/api/trabajadores/{id}", 1L))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteNotFound() throws Exception {

        doThrow(new TrabajadorNotFoundException("Trabajador no encontrado"))
                .when(trabajadorService).deleteTrabajador(99L);

        mockMvc.perform(delete("/api/trabajadores/{id}", 99L))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN") // Simulamos un usuario con el rol ADMIN
    void testActualizarEstadoPedidoSuccess() throws Exception {
        Long pedidoId = 1L;
        EstadoPedido nuevoEstado = EstadoPedido.ENTREGADO;

        // Simulamos la respuesta esperada
        PedidoResponse pedidoResponse = new PedidoResponse();
        pedidoResponse.setId(pedidoId);
        pedidoResponse.setEstado(nuevoEstado);

        // Mockeamos el servicio para que devuelva la respuesta simulada
        when(pedidoService.actualizarEstadoPedido(pedidoId, nuevoEstado)).thenReturn(pedidoResponse);

        // Ejecutamos la petición PUT
        mockMvc.perform(MockMvcRequestBuilders.put("/api/pedidos/{id}/estado", pedidoId)  // Asegúrate de usar la URL completa
                        .param("nuevoEstado", nuevoEstado.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // 200 OK
                .andExpect(jsonPath("$.estado").value(nuevoEstado.toString()));  // Verificamos que el estado sea correcto

    }

    @Test
    @WithMockUser(roles = "TRABAJADOR")  // Simulamos un usuario con el rol TRABAJADOR
    void testActualizarEstadoPedidoAsTrabajador() throws Exception {
        Long pedidoId = 1L;
        EstadoPedido nuevoEstado = EstadoPedido.PENDIENTE;

        // Simulamos el servicio
        PedidoResponse pedidoResponse = new PedidoResponse();
        pedidoResponse.setId(pedidoId);
        pedidoResponse.setEstado(nuevoEstado);

        when(pedidoService.actualizarEstadoPedido(pedidoId, nuevoEstado)).thenReturn(pedidoResponse);

        // Ejecutamos la petición PUT
        mockMvc.perform(MockMvcRequestBuilders.put("/pedidos/{id}/estado", pedidoId)
                        .param("nuevoEstado", nuevoEstado.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Comprobamos que el código de estado es 200 OK
                .andExpect(jsonPath("$.estado").value(nuevoEstado.toString()));  // Verificamos que el estado sea correcto
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testActualizarEstadoPedidoNotFound() throws Exception {
        Long pedidoId = 999L;  // Id que no existe

        // Simulamos que el servicio lanza una excepción de "Pedido no encontrado"
        when(pedidoService.actualizarEstadoPedido(pedidoId, EstadoPedido.ENTREGADO))
                .thenThrow(new PedidoNotFoundException("Pedido no encontrado"));

        // Ejecutamos la petición PUT
        mockMvc.perform(MockMvcRequestBuilders.put("/pedidos/{id}/estado", pedidoId)
                        .param("nuevoEstado", EstadoPedido.ENTREGADO.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());  // Esperamos un 404
    }

    @Test
    @WithMockUser(roles = "TRABAJADOR")
    void testActualizarEstadoPedidoBadRequest() throws Exception {
        Long pedidoId = 1L;

        // Simulamos que el servicio lanza una excepción de "IllegalArgumentException"
        when(pedidoService.actualizarEstadoPedido(pedidoId, null))
                .thenThrow(new IllegalArgumentException("Estado no válido"));

        // Ejecutamos la petición PUT
        mockMvc.perform(MockMvcRequestBuilders.put("/pedidos/{id}/estado", pedidoId)
                        .param("nuevoEstado", "")  // Enviamos un estado no válido
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());  // Esperamos un 400
    }


}
