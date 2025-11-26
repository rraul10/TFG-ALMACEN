package examen.dev.tfgalmacen.rest.trabajadores.repository;

import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {
    Optional<Trabajador> findByUserIdAndDeletedFalse(Long userId);

    Optional<Trabajador> findByUserId(Long userId);
    Optional<Trabajador> findByUser(User user);

}

