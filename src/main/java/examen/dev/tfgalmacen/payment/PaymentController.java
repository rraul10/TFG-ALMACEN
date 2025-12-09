package examen.dev.tfgalmacen.payment;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "https://tfg-almacen-front.onrender.com")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(@RequestBody Map<String, Object> data) {
        try {
            System.out.println("🔥 STRIPE KEY QUE ESTÁ LLEGANDO DESDE RENDER: " + stripeSecretKey);
            Stripe.apiKey = stripeSecretKey;

            int pedidoId = ((Number) data.get("pedidoId")).intValue();
            List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");

            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

            for (Map<String, Object> item : items) {
                String name = (String) item.get("nombre");
                int quantity = ((Number) item.get("cantidad")).intValue();
                long unitAmount = Math.round(((Number) item.get("precio")).doubleValue() * 100);

                lineItems.add(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity((long) quantity)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(unitAmount)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(name)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                );
            }

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("https://tfg-almacen-front.onrender.com/success")
                    .setCancelUrl("https://tfg-almacen-front.onrender.com/dashboard")
                    .addAllLineItem(lineItems)
                    .build();

            Session session = Session.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("url", session.getUrl());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
