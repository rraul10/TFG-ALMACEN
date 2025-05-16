package examen.dev.tfgalmacen.rest.trabajadores.repository;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.trabajadores.repository.TrabajadorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.HashSet;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.trabajadores.repository.TrabajadorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class TrabajadorRepositoryTest {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Test
    @Transactional
    public void testFindByUserIdAndDeletedFalse() {
        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(new HashSet<>())
                .build();

        Trabajador trabajador = Trabajador.builder()
                .user(user)
                .numeroSeguridadSocial("123-45-6789")
                .deleted(false)
                .build();

        trabajadorRepository.save(trabajador);

        Optional<Trabajador> foundTrabajador = trabajadorRepository.findByUserIdAndDeletedFalse(1L);

        assertTrue(foundTrabajador.isPresent(), "El trabajador debería existir");
        assertEquals("Juan Pérez", foundTrabajador.get().getUser().getNombre());
        assertFalse(foundTrabajador.get().isDeleted(), "El trabajador no debería estar eliminado");
    }



    @Test
    @Transactional
    public void testFindByUserIdAndDeletedFalse_NoResult() {
        Optional<Trabajador> foundTrabajador = trabajadorRepository.findByUserIdAndDeletedFalse(999L);

        assertFalse(foundTrabajador.isPresent(), "No debería existir un trabajador con este ID de usuario");
    }
}
