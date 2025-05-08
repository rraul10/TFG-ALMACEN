package examen.dev.tfgalmacen.trabajadores.service;

import examen.dev.tfgalmacen.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.trabajadores.dto.TrabajadorResponse;

import java.util.List;

public interface TrabajadorService {
    List<TrabajadorResponse> getAll();

    TrabajadorResponse getTrabajadorById(Long id);

    TrabajadorResponse crearTrabajador(TrabajadorRequest request);

    TrabajadorResponse updateTrabajador(Long id, TrabajadorRequest request);

    void deleteTrabajador(Long id);
}

