package examen.dev.tfgalmacen.rest.trabajadores.service;

import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.rest.trabajadores.exceptions.TrabajadorNotFoundException;
import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.trabajadores.repository.TrabajadorRepository;
import examen.dev.tfgalmacen.rest.trabajadores.service.TrabajadorServiceImpl;
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TrabajadorServiceImplTest {

    @InjectMocks
    private TrabajadorServiceImpl trabajadorService;

    @Mock
    private TrabajadorRepository trabajadorRepository;

    @Mock
    private UserRepository userRepository;

    private User user;
    private Trabajador trabajador;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Crear un usuario para la prueba
        user = new User();
        user.setId(1L);
        user.setNombre("Juan Pérez");
        user.setCorreo("juan@example.com");

        // Crear un trabajador asociado al usuario
        trabajador = Trabajador.builder()
                .id(1L)
                .user(user)
                .numeroSeguridadSocial("123-45-6789")
                .created(LocalDateTime.now())
                .updated(LocalDateTime.now())
                .deleted(false)
                .build();
    }

    @Test
    void testGetAll() {
        when(trabajadorRepository.findAll()).thenReturn(Arrays.asList(trabajador));

        List<TrabajadorResponse> trabajadores = trabajadorService.getAll();

        assertNotNull(trabajadores);
        assertEquals(1, trabajadores.size());
        assertEquals("juan@example.com", trabajadores.get(0).getCorreo());
    }

    @Test
    void testGetAll_NotFound() {

        when(trabajadorRepository.findAll()).thenReturn(Arrays.asList());

        assertThrows(TrabajadorNotFoundException.class, () -> trabajadorService.getAll());
    }


    @Test
    void testGetTrabajadorById() {
        when(trabajadorRepository.findById(1L)).thenReturn(Optional.of(trabajador));

        TrabajadorResponse response = trabajadorService.getTrabajadorById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("123-45-6789", response.getNumeroSeguridadSocial());
    }

    @Test
    void testGetTrabajadorByIdNotFound() {
        when(trabajadorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TrabajadorNotFoundException.class, () -> trabajadorService.getTrabajadorById(1L));
    }

    @Test
    void testCrearTrabajador() {
        TrabajadorRequest request = new TrabajadorRequest();
        request.setUserId(user.getId());
        request.setNumeroSeguridadSocial("123-45-6789");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(trabajadorRepository.save(any(Trabajador.class))).thenReturn(trabajador);

        TrabajadorResponse response = trabajadorService.crearTrabajador(request);

        assertNotNull(response);
        assertEquals("juan@example.com", response.getCorreo());
        assertEquals("Juan Pérez", response.getNombre());
    }

    @Test
    void testCrearTrabajadorUserNotFound() {
        TrabajadorRequest request = new TrabajadorRequest();
        request.setUserId(999L);

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(UserNotFound.class, () -> trabajadorService.crearTrabajador(request));
    }

    @Test
    void testUpdateTrabajador() {
        TrabajadorRequest request = new TrabajadorRequest();
        request.setNumeroSeguridadSocial("987-65-4321");

        when(trabajadorRepository.findById(1L)).thenReturn(Optional.of(trabajador));
        when(trabajadorRepository.save(any(Trabajador.class))).thenReturn(trabajador);

        TrabajadorResponse response = trabajadorService.updateTrabajador(1L, request);

        assertNotNull(response);
        assertEquals("987-65-4321", response.getNumeroSeguridadSocial());
    }

    @Test
    void testUpdateTrabajadorNotFound() {
        TrabajadorRequest request = new TrabajadorRequest();
        request.setNumeroSeguridadSocial("987-65-4321");

        when(trabajadorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TrabajadorNotFoundException.class, () -> trabajadorService.updateTrabajador(1L, request));
    }

    @Test
    void testDeleteTrabajador() {
        when(trabajadorRepository.findById(1L)).thenReturn(Optional.of(trabajador));

        trabajadorService.deleteTrabajador(1L);

        verify(trabajadorRepository, times(1)).save(trabajador);
        assertTrue(trabajador.isDeleted());
    }

    @Test
    void testDeleteTrabajadorNotFound() {

        when(trabajadorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TrabajadorNotFoundException.class, () -> trabajadorService.deleteTrabajador(1L));
    }
}
