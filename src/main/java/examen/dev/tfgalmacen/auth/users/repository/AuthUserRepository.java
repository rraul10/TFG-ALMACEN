package examen.dev.tfgalmacen.auth.users.repository;

import examen.dev.tfgalmacen.users.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCorreo(String correo);
}

