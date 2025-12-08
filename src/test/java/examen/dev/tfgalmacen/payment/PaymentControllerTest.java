package examen.dev.tfgalmacen.payment;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.*;
import org.mockito.MockedStatic;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import static org.mockito.Mockito.*;

class PaymentControllerTest {

    private PaymentController controller;
    private MockedStatic<Session> sessionMock;

    @BeforeEach
    void setUp() throws Exception {
        controller = new PaymentController();

        Field field = PaymentController.class.getDeclaredField("stripeSecretKey");
        field.setAccessible(true);
        field.set(controller, "sk_test_12345");

        sessionMock = mockStatic(Session.class);
    }


    @AfterEach
    void tearDown() {
        sessionMock.close();
    }

    @Test
    void createCheckoutSessionok() throws Exception {
        Map<String, Object> request = Map.of(
                "pedidoId", 10,
                "items", List.of(
                        Map.of("nombre", "Teclado", "cantidad", 1, "precio", 29.99),
                        Map.of("nombre", "Ratón", "cantidad", 2, "precio", 15.50)
                )
        );

        Session fakeSession = mock(Session.class);
        when(fakeSession.getUrl()).thenReturn("https://stripe.com/checkout_session_test");

        sessionMock.when(() -> Session.create(any(SessionCreateParams.class)))
                .thenReturn(fakeSession);

        ResponseEntity<Map<String, Object>> response = controller.createCheckoutSession(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("https://stripe.com/checkout_session_test", response.getBody().get("url"));
    }

    @Test
    void createCheckoutSessionerror() throws Exception {
        Map<String, Object> request = Map.of(
                "pedidoId", 10,
                "items", List.of()
        );

        sessionMock.when(() -> Session.create(any(SessionCreateParams.class)))
                .thenThrow(new RuntimeException("Stripe error"));

        ResponseEntity<Map<String, Object>> response = controller.createCheckoutSession(request);

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().get("error").toString().contains("Stripe error"));
    }
}
