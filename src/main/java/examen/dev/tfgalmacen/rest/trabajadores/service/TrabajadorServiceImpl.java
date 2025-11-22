package examen.dev.tfgalmacen.rest.trabajadores.service;


import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.rest.trabajadores.exceptions.TrabajadorNotFoundException;
import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.trabajadores.repository.TrabajadorRepository;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrabajadorServiceImpl implements TrabajadorService {

    private final TrabajadorRepository trabajadorRepository;
    private final UserRepository userRepository;

    @Override
    public List<TrabajadorResponse> getAll() {
        List<Trabajador> trabajadores = trabajadorRepository.findAll();
        if (trabajadores.isEmpty()) {
            throw new TrabajadorNotFoundException("No se encontraron trabajadores");
        }
        return trabajadores.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public TrabajadorResponse getTrabajadorById(Long id) {
        Trabajador trabajador = trabajadorRepository.findById(id)
                .orElseThrow(() -> new TrabajadorNotFoundException("Trabajador no encontrado"));
        return mapToResponse(trabajador);
    }

    @Override
    public TrabajadorResponse crearTrabajador(TrabajadorRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        Trabajador trabajador = Trabajador.builder()
                .user(user)
                .numeroSeguridadSocial(request.getNumeroSeguridadSocial())
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();

        trabajador = trabajadorRepository.save(trabajador);
        return mapToResponse(trabajador);
    }

    @Override
    public TrabajadorResponse updateTrabajador(Long id, TrabajadorRequest request) {
        Trabajador trabajador = trabajadorRepository.findById(id)
                .orElseThrow(() -> new TrabajadorNotFoundException("Trabajador no encontrado"));

        trabajador.setNumeroSeguridadSocial(request.getNumeroSeguridadSocial());
        trabajador.setUpdated(LocalDateTime.now());

        return mapToResponse(trabajadorRepository.save(trabajador));
    }

    @Override
    public void deleteTrabajador(Long id) {
        Trabajador trabajador = trabajadorRepository.findById(id)
                .orElseThrow(() -> new TrabajadorNotFoundException("Trabajador no encontrado"));

        trabajador.setDeleted(true);
        trabajador.setUpdated(LocalDateTime.now());
        trabajadorRepository.save(trabajador);
    }

    private TrabajadorResponse mapToResponse(Trabajador t) {
        return TrabajadorResponse.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .nombre(t.getUser().getNombre())
                .correo(t.getUser().getCorreo())
                .numeroSeguridadSocial(t.getNumeroSeguridadSocial())
                .build();
    }

    @Override
    public TrabajadorResponse getByUserId(Long userId) {
        Trabajador trabajador = trabajadorRepository.findByUserId(userId)
                .orElseThrow(() -> new TrabajadorNotFoundException("Trabajador no encontrado"));
        return mapToResponse(trabajador);
    }

}

