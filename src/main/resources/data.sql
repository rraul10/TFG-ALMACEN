-- USERS
INSERT INTO users (id, nombre, correo, password, created, updated, deleted) VALUES
    (1, 'Admin Principal', 'admin@example.com', '$2a$12$UFlfPUUOd3hVjJYrJLvPYekmFtsZbuTzh2q0yhmYSDbaNoTCOf/TS', NOW(), NOW(), false),
    (2, 'Trabajador Uno', 'trabajador1@example.com', '$2a$12$/d1KeggIn8zzJlkxSiievuWZtxTnPRsx9KhV/34F3ceV1SwZO.WeG', NOW(), NOW(), false),
    (3, 'Trabajador Dos', 'trabajador2@example.com', '$2a$12$0lcB19.P54vSZ.GeZR/Y6Ob/DH3YAk2eRvyhMxt0hi4UVMUA348BK', NOW(), NOW(), false),
    (4, 'Trabajador Tres', 'trabajador3@example.com', '$2a$12$r6M0D9rxAx..zSsvHJ9d1OFXDNfy0/VeeQIeGhi1OJT.4/dRkXCr6', NOW(), NOW(), false),
    (5, 'Raúl Fernández', 'raulspotify6106@gmail.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (6, 'Yahya El Hadri', 'yahya@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (7, 'Samuel Cortes', 'samu@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (8, 'Javier Hernandez', 'javi@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (9, 'Javier Ruiz', 'javierruiz@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (10, 'Pedro PicaPiedra', 'pedro@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (11, 'Ruben Gomez', 'ruben@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (12, 'Sergio Peña', 'sergio@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (13, 'Victor Conde', 'victor@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false),
    (14, 'Javier Garzas', 'javiergarzas@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', NOW(), NOW(), false);

-- ROLES
INSERT INTO user_roles (user_id, roles) VALUES
    (1, 'ADMIN'),
    (2, 'TRABAJADOR'),
    (3, 'TRABAJADOR'),
    (4, 'TRABAJADOR'),
    (5, 'CLIENTE'),
    (6, 'CLIENTE'),
    (7, 'CLIENTE'),
    (8, 'CLIENTE'),
    (9, 'CLIENTE'),
    (10, 'CLIENTE'),
    (11, 'CLIENTE'),
    (12, 'CLIENTE'),
    (13, 'CLIENTE'),
    (14, 'CLIENTE');

-- CLIENTES (1–10)
INSERT INTO cliente (id, user_id, direccion_envio, dni, foto_dni, created, updated, deleted) VALUES
    (1, 5, 'Calle Falsa 123', '11111111A', 'foto1.jpg', NOW(), NOW(), false),
    (2, 6, 'Calle Falsa 124', '22222222B', 'foto2.jpg', NOW(), NOW(), false),
    (3, 7, 'Calle Falsa 125', '33333333C', 'foto3.jpg', NOW(), NOW(), false),
    (4, 8, 'Calle Falsa 126', '44444444D', 'foto4.jpg', NOW(), NOW(), false),
    (5, 9, 'Calle Falsa 127', '55555555E', 'foto5.jpg', NOW(), NOW(), false),
    (6, 10, 'Calle Falsa 128', '66666666F', 'foto6.jpg', NOW(), NOW(), false),
    (7, 11, 'Calle Falsa 129', '77777777G', 'foto7.jpg', NOW(), NOW(), false),
    (8, 12, 'Calle Falsa 130', '88888888H', 'foto8.jpg', NOW(), NOW(), false),
    (9, 13, 'Calle Falsa 131', '99999999I', 'foto9.jpg', NOW(), NOW(), false),
    (10, 14, 'Calle Falsa 132', '00000000J', 'foto10.jpg', NOW(), NOW(), false);

-- TRABAJADORES
INSERT INTO trabajador (id, user_id, numero_seguridad_social, created, updated, deleted) VALUES
    (1, 2, 'SS001', NOW(), NOW(), false),
    (2, 3, 'SS002', NOW(), NOW(), false),
    (3, 4, 'SS003', NOW(), NOW(), false);

-- PEDIDOS (cliente_id = 1)
INSERT INTO pedido (id, cliente_id, estado, fecha, created, updated, deleted) VALUES
    (1, 1, 'PENDIENTE', NOW(), NOW(), NOW(), false),
    (2, 1, 'PREPARACION', NOW(), NOW(), NOW(), false),
    (3, 1, 'ENVIADO', NOW(), NOW(), NOW(), false);

INSERT INTO productos (nombre, tipo, imagen, descripcion, precio, stock, created, updated, is_deleted)
VALUES
    ('Camiseta Algodón', 'Ropa', 'camiseta.jpg', 'Camiseta de algodón 100% orgánico', 14.99, 17, NOW(), NOW(), false),
    ('Zapatillas Running', 'Calzado', 'zapatillas.jpg', 'Zapatillas ligeras para correr largas distancias', 59.99, 23, NOW(), NOW(), false),
    ('Mochila Urbana', 'Accesorios', 'mochila.jpg', 'Mochila con múltiples compartimentos, ideal para ciudad', 39.90, 20, NOW(), NOW(), false),
    ('Pantalones Vaqueros', 'Ropa', 'vaqueros.jpg', 'Vaqueros slim fit azul oscuro', 45.00, 40, NOW(), NOW(), false),
    ('Reloj Digital', 'Tecnología', 'reloj.jpg', 'Reloj resistente al agua con cronómetro y alarma', 25.50, 15, NOW(), NOW(), false),
    ('Auriculares Bluetooth', 'Tecnología', 'auriculares.jpg', 'Auriculares inalámbricos con cancelación de ruido', 79.95, 25, NOW(), NOW(), false),
    ('Gafas de Sol', 'Accesorios', 'gafas.jpg', 'Gafas con protección UV400 y estilo moderno', 22.99, 60, NOW(), NOW(), false),
    ('Chaqueta Impermeable', 'Ropa', 'chaqueta.jpg', 'Chaqueta ligera, ideal para lluvia y viento', 69.90, 8, NOW(), NOW(), false),
    ('Bolsa de Deporte', 'Accesorios', 'bolsa.jpg', 'Bolsa espaciosa para gimnasio o viajes cortos', 29.99, 35, NOW(), NOW(), false),
    ('Cargador Inalámbrico', 'Tecnología', 'cargador.jpg', 'Cargador rápido compatible con la mayoría de smartphones', 19.99, 45, NOW(), NOW(), false);

-- Ajustar secuencia para evitar conflictos con ID ya existentes
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Ajustar secuencia para evitar conflictos con IDs ya existentes en "trabajador"
SELECT setval('trabajador_id_seq', (SELECT MAX(id) FROM trabajador));

-- Ajustar secuencia para evitar conflictos con IDs ya existentes en "cliente"
SELECT setval('cliente_id_seq', (SELECT MAX(id) FROM cliente));



