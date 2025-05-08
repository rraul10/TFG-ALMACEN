package examen.dev.tfgalmacen.trabajadores.controller;

import examen.dev.tfgalmacen.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.trabajadores.exceptions.TrabajadorNotFoundException;
import examen.dev.tfgalmacen.trabajadores.service.TrabajadorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
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


}
