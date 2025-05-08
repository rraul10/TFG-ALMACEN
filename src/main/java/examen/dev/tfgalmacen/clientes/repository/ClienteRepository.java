package examen.dev.tfgalmacen.clientes.repository;

import examen.dev.tfgalmacen.clientes.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByUserId(Long userId);
}


