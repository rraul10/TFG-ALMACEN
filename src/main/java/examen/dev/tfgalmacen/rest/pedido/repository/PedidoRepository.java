package examen.dev.tfgalmacen.rest.pedido.repository;

import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @Query("SELECT p FROM Pedido p LEFT JOIN FETCH p.lineasVenta WHERE p.id = :id AND p.deleted = false")
    Optional<Pedido> findByIdAndDeletedFalse(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Pedido p LEFT JOIN FETCH p.lineasVenta WHERE p.deleted = false")
    List<Pedido> findAllByDeletedFalse();
}
