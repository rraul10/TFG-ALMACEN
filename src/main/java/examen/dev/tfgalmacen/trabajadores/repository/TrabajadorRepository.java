package examen.dev.tfgalmacen.trabajadores.repository;

import examen.dev.tfgalmacen.trabajadores.models.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {
    Optional<Trabajador> findByUserIdAndDeletedFalse(Long userId);
}

