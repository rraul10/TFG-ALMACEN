package examen.dev.tfgalmacen.rest.clientes.repository;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByUserId(Long userId);
}


