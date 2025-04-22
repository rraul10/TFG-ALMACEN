-- Insertar usuarios
INSERT INTO users (id, nombre, correo, password, created, updated, is_deleted)
VALUES
    (1, 'Admin', 'admin@example.com', '$2a$12$ldx5F5SM6dVh0q/OjIzTJeFKoW4Jsu6c3r.AM9uDJWkZtlmolEXyW', NOW(), NOW(), false),
    (2, 'Raul Fernandez', 'rauldelgado@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false);

-- Insertar roles
INSERT INTO user_roles (user_id, roles)
VALUES
    (1, 'ADMIN'),
    (2, 'CLIENTE');


INSERT INTO productos (nombre, tipo, imagen, descripcion, precio, stock, created, updated, is_deleted)
VALUES
    ('Camiseta Algodón', 'Ropa', 'camiseta.jpg', 'Camiseta de algodón 100% orgánico', 14.99, 50, NOW(), NOW(), false),
    ('Zapatillas Running', 'Calzado', 'zapatillas.jpg', 'Zapatillas ligeras para correr largas distancias', 59.99, 30, NOW(), NOW(), false),
    ('Mochila Urbana', 'Accesorios', 'mochila.jpg', 'Mochila con múltiples compartimentos, ideal para ciudad', 39.90, 20, NOW(), NOW(), false),
    ('Pantalones Vaqueros', 'Ropa', 'vaqueros.jpg', 'Vaqueros slim fit azul oscuro', 45.00, 40, NOW(), NOW(), false),
    ('Reloj Digital', 'Tecnología', 'reloj.jpg', 'Reloj resistente al agua con cronómetro y alarma', 25.50, 15, NOW(), NOW(), false),
    ('Auriculares Bluetooth', 'Tecnología', 'auriculares.jpg', 'Auriculares inalámbricos con cancelación de ruido', 79.95, 25, NOW(), NOW(), false),
    ('Gafas de Sol', 'Accesorios', 'gafas.jpg', 'Gafas con protección UV400 y estilo moderno', 22.99, 60, NOW(), NOW(), false),
    ('Chaqueta Impermeable', 'Ropa', 'chaqueta.jpg', 'Chaqueta ligera, ideal para lluvia y viento', 69.90, 18, NOW(), NOW(), false),
    ('Bolsa de Deporte', 'Accesorios', 'bolsa.jpg', 'Bolsa espaciosa para gimnasio o viajes cortos', 29.99, 35, NOW(), NOW(), false),
    ('Cargador Inalámbrico', 'Tecnología', 'cargador.jpg', 'Cargador rápido compatible con la mayoría de smartphones', 19.99, 45, NOW(), NOW(), false);
