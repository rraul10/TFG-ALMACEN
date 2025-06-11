package examen.dev.tfgalmacen.rest.trabajadores.mapper;

import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorRequest;
import examen.dev.tfgalmacen.rest.trabajadores.dto.TrabajadorResponse;
import examen.dev.tfgalmacen.rest.trabajadores.models.Trabajador;
import examen.dev.tfgalmacen.rest.users.UserRole;
import examen.dev.tfgalmacen.rest.users.models.User;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.HashSet;
import java.util.Set;

import org.mockito.MockitoAnnotations;

public class TrabajadorMapperTest {

    @InjectMocks
    private TrabajadorMapper trabajadorMapper;

    @Mock
    private User userMock;

    public TrabajadorMapperTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testToEntity() {
        TrabajadorRequest request = TrabajadorRequest.builder()
                .numeroSeguridadSocial("123-45-6789")
                .build();

        Set<UserRole> roles = new HashSet<>();
        roles.add(UserRole.TRABAJADOR);

        when(userMock.getId()).thenReturn(1L);
        when(userMock.getNombre()).thenReturn("Juan Pérez");
        when(userMock.getCorreo()).thenReturn("juan.perez@example.com");
        when(userMock.getRoles()).thenReturn(roles);

        Trabajador trabajador = trabajadorMapper.toEntity(request, userMock);

        assertNotNull(trabajador);
        assertEquals("123-45-6789", trabajador.getNumeroSeguridadSocial());
        assertEquals(1L, trabajador.getUser().getId().longValue());
        assertEquals("Juan Pérez", trabajador.getUser().getNombre());
        assertEquals("juan.perez@example.com", trabajador.getUser().getCorreo());
        assertFalse(trabajador.isDeleted());
        assertNotNull(trabajador.getCreated());
        assertNotNull(trabajador.getUpdated());
    }

    @Test
    public void testToDto() {
        Set<UserRole> roles = new HashSet<>();
        roles.add(UserRole.TRABAJADOR);

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        Trabajador trabajador = Trabajador.builder()
                .id(1L)
                .user(user)
                .numeroSeguridadSocial("123-45-6789")
                .build();

        TrabajadorResponse trabajadorResponse = trabajadorMapper.toDto(trabajador);

        assertNotNull(trabajadorResponse);
        assertEquals(1L, trabajadorResponse.getId().longValue());
        assertEquals(1L, trabajadorResponse.getUserId().longValue());
        assertEquals("Juan Pérez", trabajadorResponse.getNombre());
        assertEquals("juan.perez@example.com", trabajadorResponse.getCorreo());
        assertEquals("123-45-6789", trabajadorResponse.getNumeroSeguridadSocial());
    }

    @Test
    public void testUpdateEntityFromRequest() {
        TrabajadorRequest request = TrabajadorRequest.builder()
                .numeroSeguridadSocial("987-65-4321")
                .build();

        Set<UserRole> roles = new HashSet<>();
        roles.add(UserRole.TRABAJADOR);

        User user = User.builder()
                .id(1L)
                .nombre("Juan Pérez")
                .correo("juan.perez@example.com")
                .roles(roles)
                .build();

        Trabajador trabajador = Trabajador.builder()
                .id(1L)
                .user(user)
                .numeroSeguridadSocial("123-45-6789")
                .build();

        trabajadorMapper.updateEntityFromRequest(trabajador, request);

        assertEquals("987-65-4321", trabajador.getNumeroSeguridadSocial());
        assertNotNull(trabajador.getUpdated());
    }
}

