package examen.dev.tfgalmacen.rest.productos.repository;

import examen.dev.tfgalmacen.rest.productos.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}

