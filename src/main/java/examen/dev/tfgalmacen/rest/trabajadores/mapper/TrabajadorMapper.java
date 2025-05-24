package examen.dev.tfgalmacen.rest.trabajadores.mapper;

import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TrabajadorMapper {

    public Trabajador toEntity(TrabajadorRequest request, User user) {
        return Trabajador.builder()
                .user(user)
                .numeroSeguridadSocial(request.getNumeroSeguridadSocial())
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();
    }

    public TrabajadorResponse toDto(Trabajador trabajador) {
        return TrabajadorResponse.builder()
                .id(trabajador.getId())
                .userId(trabajador.getUser().getId())
                .nombre(trabajador.getUser().getNombre())
                .correo(trabajador.getUser().getCorreo())
                .numeroSeguridadSocial(trabajador.getNumeroSeguridadSocial())
                .build();
    }

    public void updateEntityFromRequest(Trabajador trabajador, TrabajadorRequest request) {
        trabajador.setNumeroSeguridadSocial(request.getNumeroSeguridadSocial());
        trabajador.setUpdated(LocalDateTime.now());
    }
}

