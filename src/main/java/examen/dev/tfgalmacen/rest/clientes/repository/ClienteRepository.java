package examen.dev.tfgalmacen.rest.clientes.repository;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByUserId(Long userId);
    Optional<Cliente> findByUser(User user);
}


