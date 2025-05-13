package examen.dev.tfgalmacen.rest.users.repository;


import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCorreo(String correo);
    Optional<User> findById(Long id);
}

