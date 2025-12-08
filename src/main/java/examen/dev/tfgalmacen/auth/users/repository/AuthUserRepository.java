package examen.dev.tfgalmacen.auth.users.repository;

import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCorreo(String correo);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.cliente")
    List<User> findAllWithCliente();
}

