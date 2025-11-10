-- USERS
    INSERT INTO users (id, nombre, apellidos, correo, password, telefono, ciudad, foto, created, updated, deleted) VALUES
        (1, 'Admin Principal', 'Admin', 'admin@example.com', '$2a$12$UFlfPUUOd3hVjJYrJLvPYekmFtsZbuTzh2q0yhmYSDbaNoTCOf/TS', '600000001', 'Madrid', 'admin.jpg', NOW(), NOW(), false),
        (2, 'Trabajador Uno', 'Perez', 'trabajador1@example.com', '$2a$12$/d1KeggIn8zzJlkxSiievuWZtxTnPRsx9KhV/34F3ceV1SwZO.WeG', '600000002', 'Barcelona', 'trabajador1.jpg', NOW(), NOW(), false),
        (3, 'Trabajador Dos', 'Gomez', 'trabajador2@example.com', '$2a$12$0lcB19.P54vSZ.GeZR/Y6Ob/DH3YAk2eRvyhMxt0hi4UVMUA348BK', '600000003', 'Valencia', 'trabajador2.jpg', NOW(), NOW(), false),
        (4, 'Trabajador Tres', 'Lopez', 'trabajador3@example.com', '$2a$12$r6M0D9rxAx..zSsvHJ9d1OFXDNfy0/VeeQIeGhi1OJT.4/dRkXCr6', '600000004', 'Sevilla', 'trabajador3.jpg', NOW(), NOW(), false),
        (5, 'Raúl', 'Fernández', 'raulspotify6106@gmail.com', '$2a$12$T25nQ90HvBR/3WIxPryDzeE6IX.pQiFA.wrqfCg/LLVMkFoXVLOje', '600000005', 'Madrid', 'imagenral.jpg', NOW(), NOW(), false),
        (6, 'Yahya', 'El Hadri', 'yahya@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000006', 'Barcelona', 'yahya.jpg', NOW(), NOW(), false),
        (7, 'Samuel', 'Cortes', 'samu@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000007', 'Valencia', 'samuel.jpg', NOW(), NOW(), false),
        (8, 'Javier', 'Hernandez', 'javi@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000008', 'Sevilla', 'javierh.jpg', NOW(), NOW(), false),
        (9, 'Javier', 'Ruiz', 'javierruiz@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000009', 'Bilbao', 'javierruiz.jpg', NOW(), NOW(), false),
        (10, 'Pedro', 'PicaPiedra', 'pedro@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000010', 'Zaragoza', 'pedro.jpg', NOW(), NOW(), false),
        (11, 'Ruben', 'Gomez', 'ruben@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000011', 'Madrid', 'ruben.jpg', NOW(), NOW(), false),
        (12, 'Sergio', 'Peña', 'sergio@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000012', 'Barcelona', 'sergio.jpg', NOW(), NOW(), false),
        (13, 'Victor', 'Conde', 'victor@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000013', 'Valencia', 'victor.jpg', NOW(), NOW(), false),
        (14, 'Javier', 'Garzas', 'javiergarzas@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000014', 'Sevilla', 'javiergarzas.jpg', NOW(), NOW(), false);

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
    (1, 5, 'Calle Falsa 123', '11111111A', 'default.jpg', NOW(), NOW(), false),
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

INSERT INTO productos (nombre, tipo, imagen, descripcion, precio, stock, created, updated, is_deleted) VALUES
                                                                                                           ('Auriculares Gaming Xtreme 7.1', 'Auriculares', 'auriculares_gaming_7_1.jpg', 'Auriculares para gaming con sonido 7.1 envolvente y micrófono retráctil', 129.99, 50, NOW(), NOW(), false),
                                                                                                           ('Teclado Mecánico RGB Pro', 'Teclado', 'teclado_mecanico_rgb.jpg', 'Teclado mecánico con switches táctiles, iluminación RGB personalizable', 89.95, 75, NOW(), NOW(), false),
                                                                                                           ('Ratón Inalámbrico UltraPrecision', 'Ratón', 'raton_inalambrico_ultraprecision.jpg', 'Ratón inalámbrico para gaming y productividad con sensor de alta precisión', 59.99, 120, NOW(), NOW(), false),
                                                                                                           ('Monitor 27″ QHD 144 Hz', 'Monitor', 'monitor_27_qhd_144hz.jpg', 'Monitor de 27 pulgadas QHD con frecuencia de actualización de 144Hz y panel IPS', 299.90, 40, NOW(), NOW(), false),
                                                                                                           ('Tarjeta Gráfica RTX 4070 Ti', 'Tarjeta Gráfica', 'gpu_rtx_4070_ti.jpg', 'Tarjeta gráfica de alto rendimiento RTX 4070 Ti para gaming y edición', 799.99, 15, NOW(), NOW(), false),
                                                                                                           ('Placa Base ATX Gaming Z790', 'Placa Base', 'placa_base_z790.jpg', 'Placa base ATX con chipset Z790, preparada para Intel 14ª Gen', 249.50, 30, NOW(), NOW(), false),
                                                                                                           ('Memoria RAM DDR5 32 GB 6000MHz', 'RAM', 'ram_ddr5_32gb_6000.jpg', 'Kit de memoria DDR5‑6000 de 32 GB (2×16) para rendimiento extremo', 179.00, 65, NOW(), NOW(), false),
                                                                                                           ('SSD NVMe M.2 2 TB', 'SSD', 'ssd_nvme_2tb.jpg', 'Unidad SSD NVMe M.2 de 2TB con velocidades de lectura/escritura ultrarrápidas', 219.99, 45, NOW(), NOW(), false),
                                                                                                           ('Fuente de Alimentación 850 W Modular', 'Fuente', 'psu_850w_modular.jpg', 'Fuente de alimentación modular de 850 W, certificación 80+ Gold', 139.95, 35, NOW(), NOW(), false),
                                                                                                           ('Refrigeración Líquida AIO 240mm', 'Refrigeración', 'refrigeracion_liquida_240mm.jpg', 'Sistema de refrigeración líquida AIO de 240mm para disipación eficiente', 109.90, 25, NOW(), NOW(), false),
                                                                                                           ('Caja PC Mid‑Tower RGB', 'Caja PC', 'caja_pc_mid_tower_rgb.jpg', 'Caja para PC tipo mid‑tower con iluminación RGB integrada y panel de vidrio templado', 89.99, 50, NOW(), NOW(), false),
                                                                                                           ('Monitor Curvo 34″ Ultrawide', 'Monitor', 'monitor_curvo_34_ultrawide.jpg', 'Monitor curvo de 34″ ultrawide 3440×1440 para productividad y gaming inmersivo', 449.00, 20, NOW(), NOW(), false),
                                                                                                           ('Kit Teclado + Ratón Inalámbrico', 'Kit Periféricos', 'kit_teclado_raton_inalambrico.jpg', 'Pack completado con teclado y ratón inalámbricos para oficina o gaming casual', 74.99, 80, NOW(), NOW(), false),
                                                                                                           ('Webcam Full HD 1080p', 'Webcam', 'webcam_fullhd_1080p.jpg', 'Webcam Full HD 1080p con micrófono incorporado para streaming', 49.99, 90, NOW(), NOW(), false),
                                                                                                           ('Micrófono USB Condensador', 'Micrófono', 'microfono_usb_condensador.jpg', 'Micrófono USB de condensador para streaming, podcast y grabación', 59.50, 60, NOW(), NOW(), false),
                                                                                                           ('Auriculares Bluetooth Cancelación Ruido', 'Auriculares', 'auriculares_bt_cancelacion.jpg', 'Auriculares Bluetooth con cancelación activa de ruido y carga rápida', 99.99, 55, NOW(), NOW(), false),
                                                                                                           ('Monitor Gaming 24″ 165Hz', 'Monitor', 'monitor_gaming_24_165hz.jpg', 'Monitor para gaming de 24″ con frecuencia de actualización de 165Hz y tiempo de respuesta 1ms', 219.90, 45, NOW(), NOW(), false),
                                                                                                           ('Tarjeta Gráfica RTX 4060 Super', 'Tarjeta Gráfica', 'gpu_rtx_4060_super.jpg', 'Tarjeta gráfica RTX 4060 Super para 1080p / 1440p fluido', 549.00, 18, NOW(), NOW(), false),
                                                                                                           ('Placa Base Micro‑ATX B660', 'Placa Base', 'placa_base_b660_microatx.jpg', 'Placa base Micro‑ATX con chipset B660, compatible Intel 13ª/14ª Gen', 159.00, 40, NOW(), NOW(), false),
                                                                                                           ('Memoria RAM DDR4 16 GB 3200MHz', 'RAM', 'ram_ddr4_16gb_3200.jpg', 'Kit de memoria DDR4‑3200 de 16 GB (2×8) para sistemas más económicos', 69.99, 110, NOW(), NOW(), false),
                                                                                                           ('SSD SATA 1 TB', 'SSD', 'ssd_sata_1tb.jpg', 'Unidad SSD SATA de 1TB para mejorar rendimiento general del sistema', 109.99, 70, NOW(), NOW(), false),
                                                                                                           ('Unidad Externa HDD 4 TB USB‑C', 'Disco Externo', 'hdd_externo_4tb_usb_c.jpg', 'Disco duro externo de 4TB con conexión USB‑C para almacenamiento adicional', 119.90, 65, NOW(), NOW(), false),
                                                                                                           ('Sistema Altavoces 2.1 Inalámbricos', 'Altavoces', 'altavoces_2_1_inalambricos.jpg', 'Sistema de altavoces inalámbricos 2.1 con subwoofer para entretenimiento multimedia', 79.95, 80, NOW(), NOW(), false),
                                                                                                           ('Silla Gaming Ergonomica', 'Silla', 'silla_gaming_ergonomica.jpg', 'Silla ergonómica para gaming con respaldo alto, reposabrazos ajustable y ruedas', 189.00, 22, NOW(), NOW(), false),
                                                                                                           ('Kit Refrigeración por Aire CPU', 'Refrigeración', 'caja_refrigeracion_aire_cpu.jpg', 'Cooler de aire de alto rendimiento para CPU con ventilador RGB', 49.99, 100, NOW(), NOW(), false),
                                                                                                           ('Tarjeta de Sonido Externa USB', 'Tarjeta de Sonido', 'tarjeta_sonido_externa_usb.jpg', 'Tarjeta de sonido externa USB para mejorar la calidad de audio en PC', 89.90, 30, NOW(), NOW(), false),
                                                                                                           ('Micrófono de Brazo para Streaming', 'Micrófono', 'microfono_brazo_streaming.jpg', 'Micrófono profesional con brazo articulado para streaming y podcasts', 69.95, 40, NOW(), NOW(), false),
                                                                                                           ('Teclado Mecánico Compacto 65%', 'Teclado', 'teclado_mecanico_65.jpg', 'Teclado mecánico compacto 65% con iluminación RGB y switch rojo silencioso', 99.99, 50, NOW(), NOW(), false),
                                                                                                           ('Ratón Gaming Óptico 12 000 DPI', 'Ratón', 'raton_gaming_12000dpi.jpg', 'Ratón óptico gaming con sensor de 12 000 DPI y diseño ambidiestro ligero', 79.90, 60, NOW(), NOW(), false),
                                                                                                           ('Auriculares Over‑Ear para Creación', 'Auriculares', 'auriculares_overear_creacion.jpg', 'Auriculares over‑ear con sonido referencia para edición de audio y vídeo', 129.00, 35, NOW(), NOW(), false),
                                                                                                           ('Monitor 32″ 4K IPS', 'Monitor', 'monitor_32_4k_ips.jpg', 'Monitor de 32″ con resolución 4K y panel IPS para edición gráfica y productividad', 499.99, 10, NOW(), NOW(), false),
                                                                                                           ('Tarjeta Gráfica RX 7900 XT', 'Tarjeta Gráfica', 'gpu_rx_7900_xt.jpg', 'Tarjeta gráfica AMD RX 7900 XT para gaming 4K y edición profesional', 899.00, 12, NOW(), NOW(), false),
                                                                                                           ('Placa Base ITX B550 WiFi', 'Placa Base', 'placa_base_b550_itx_wifi.jpg', 'Placa base ITX con chipset B550 y WiFi integrado para mini‑PCs', 179.00, 28, NOW(), NOW(), false),
                                                                                                           ('Memoria RAM DDR4 32 GB 3600MHz', 'RAM', 'ram_ddr4_32gb_3600.jpg', 'Kit de memoria DDR4‑3600 de 32 GB para sistemas gaming de gama media', 149.99, 55, NOW(), NOW(), false),
                                                                                                           ('SSD NVMe M.2 1 TB', 'SSD', 'ssd_nvme_1tb.jpg', 'Unidad SSD NVMe M.2 de 1TB para cargas rápidas de sistema y juegos', 129.99, 90, NOW(), NOW(), false),
                                                                                                           ('Fuente de Alimentación 1000 W 80+ Platinum', 'Fuente', 'psu_1000w_platinum.jpg', 'Fuente de alimentación 1000 W certificación 80+ Platinum para rigs exigentes', 219.99, 18, NOW(), NOW(), false),
                                                                                                           ('Caja PC Full‑Tower RGB', 'Caja PC', 'caja_pc_full_tower_rgb.jpg', 'Caja PC full‑tower con iluminación RGB completa, depósito externo y panel de vidrio templado', 159.99, 22, NOW(), NOW(), false),
                                                                                                           ('Monitor 27″ Curvo 165Hz QHD', 'Monitor', 'monitor_27_curvo_165hz_qhd.jpg', 'Monitor de 27″ curvo QHD con 165Hz y tecnología FreeSync/G‑Sync', 339.95, 30, NOW(), NOW(), false),
                                                                                                           ('Webcam 4K UHD', 'Webcam', 'webcam_4k_uhd.jpg', 'Webcam 4K UHD con auto‑enfoque y micrófono dual para streaming profesional', 99.99, 40, NOW(), NOW(), false),
                                                                                                           ('Micrófono Lavalier Inalámbrico', 'Micrófono', 'microfono_lavalier_inalambrico.jpg', 'Micrófono inalámbrico tipo lavalier para grabación móvil y vlogging', 49.99, 80, NOW(), NOW(), false),
                                                                                                           ('Auriculares Gaming In‑Ear RTP', 'Auriculares', 'auriculares_gaming_inear_rtp.jpg', 'Auriculares in‑ear gaming con cable extra‑ligero y micrófono extraíble', 59.99, 70, NOW(), NOW(), false),
                                                                                                           ('Teclado Ergonomico Dividido Bluetooth', 'Teclado', 'teclado_ergonomico_dividido_bt.jpg', 'Teclado ergonómico dividido inalámbrico Bluetooth para escritura cómoda', 119.95, 34, NOW(), NOW(), false),
                                                                                                           ('Ratón Vertical Inalámbrico Ergonómico', 'Ratón', 'raton_vertical_inalambrico_ergonomico.jpg', 'Ratón vertical inalámbrico ergonómico para prevenir tensión en la muñeca', 69.90, 50, NOW(), NOW(), false),
                                                                                                           ('Placa Base XL‑ATX Gaming M.2', 'Placa Base', 'placa_base_xl_atx_gaming_m2.jpg', 'Placa base XL‑ATX de gama alta con múltiples ranuras M.2 y soporte SLI', 329.00, 14, NOW(), NOW(), false),
                                                                                                           ('Tarjeta Gráfica RTX 4080 Super', 'Tarjeta Gráfica', 'gpu_rtx_4080_super.jpg', 'Tarjeta gráfica RTX 4080 Super para gaming 4K/8K y creación de contenido', 1199.99, 8, NOW(), NOW(), false),
                                                                                                           ('Memoria RAM DDR5 64 GB 7200MHz', 'RAM', 'ram_ddr5_64gb_7200.jpg', 'Kit de memoria DDR5‑7200 de 64 GB (2×32) para estaciones de trabajo y gaming extremo', 349.99, 20, NOW(), NOW(), false),
                                                                                                           ('SSD NVMe M.2 4 TB', 'SSD', 'ssd_nvme_4tb.jpg', 'Unidad SSD NVMe M.2 de 4TB para almacenamiento ultra elevado', 499.99, 12, NOW(), NOW(), false),
                                                                                                           ('Kit Ventilación RGB PC 5 Ventiladores', 'Refrigeración', 'kit_ventilacion_rgb_pc_5ventiladores.jpg', 'Kit de 5 ventiladores RGB para caja PC, flujo alto de aire y estética gaming', 39.99, 130, NOW(), NOW(), false),
                                                                                                           ('Base Refrigerante Notebook 17″', 'Refrigeración', 'base_refrigerante_notebook_17.jpg', 'Base refrigerante para notebook hasta 17″ con iluminación LED azul y ventiladores duales', 29.99, 110, NOW(), NOW(), false),
                                                                                                           ('Monitor Portátil 15.6″ USB‑C', 'Monitor', 'monitor_portatil_15_6_usb_c.jpg', 'Monitor portátil 15.6″ con conexión USB‑C, ideal para movilidad', 209.90, 37, NOW(), NOW(), false);


-- LINEAS DE VENTA
INSERT INTO linea_venta (pedido_id, producto_id, cantidad, precio_unitario) VALUES
    (1, 1, 1, 14.99),
    (1, 2, 2, 59.99),
    (2, 3, 1, 39.90),
    (3, 5, 1, 25.50);


-- Ajustar secuencia para evitar conflictos con ID ya existentes
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Ajustar secuencia para evitar conflictos con IDs ya existentes en "trabajador"
SELECT setval('trabajador_id_seq', (SELECT MAX(id) FROM trabajador));

-- Ajustar secuencia para evitar conflictos con IDs ya existentes en "cliente"
SELECT setval('cliente_id_seq', (SELECT MAX(id) FROM cliente));

SELECT setval('pedido_id_seq', (SELECT MAX(id) FROM pedido));




