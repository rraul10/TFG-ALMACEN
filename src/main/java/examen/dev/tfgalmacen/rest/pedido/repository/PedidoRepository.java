package examen.dev.tfgalmacen.rest.pedido.repository;

import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByIdAndDeletedFalse(Long id);
    List<Pedido> findAllByDeletedFalse();
}
