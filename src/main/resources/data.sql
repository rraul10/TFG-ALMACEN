DELETE FROM linea_venta;
DELETE FROM pedido;
DELETE FROM cliente;
DELETE FROM trabajador;
DELETE FROM user_roles;
DELETE FROM users;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE cliente_id_seq RESTART WITH 1;
ALTER SEQUENCE trabajador_id_seq RESTART WITH 1;
ALTER SEQUENCE pedido_id_seq RESTART WITH 1;
ALTER SEQUENCE linea_venta_id_seq RESTART WITH 1;

INSERT INTO users (nombre, apellidos, correo, password, telefono, ciudad, foto, created, updated, deleted) VALUES
                                                                                                               ('Admin Principal', 'Admin', 'admin@example.com', '$2a$12$RzuBMEtOONvqORTMnuS.su2amfN7dkrlsTaI.xZc3H8j/QTxYKxV6', '600000001', 'Madrid', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953247/persona3_xkd0vp.jpg', NOW(), NOW(), false),
                                                                                                               ('Trabajador Uno', 'Perez', 'trabajador1@example.com', '$2a$12$/d1KeggIn8zzJlkxSiievuWZtxTnPRsx9KhV/34F3ceV1SwZO.WeG', '600000002', 'Barcelona', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953244/persona13_zyt96q.jpg', NOW(), NOW(), false),
                                                                                                               ('Trabajador Dos', 'Gomez', 'trabajador2@example.com', '$2a$12$0lcB19.P54vSZ.GeZR/Y6Ob/DH3YAk2eRvyhMxt0hi4UVMUA348BK', '600000003', 'Valencia', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953246/persona6_nqejuh.jpg', NOW(), NOW(), false),
                                                                                                               ('Trabajador Tres', 'Lopez', 'trabajador3@example.com', '$2a$12$r6M0D9rxAx..zSsvHJ9d1OFXDNfy0/VeeQIeGhi1OJT.4/dRkXCr6', '600000004', 'Sevilla', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953245/persona8_q1m9am.jpg', NOW(), NOW(), false),
                                                                                                               ('Raúl', 'Fernández', 'raulspotify6106@gmail.com', '$2a$12$T25nQ90HvBR/3WIxPryDzeE6IX.pQiFA.wrqfCg/LLVMkFoXVLOje', '600000005', 'Madrid', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953247/imagenral_wfjber.jpg', NOW(), NOW(), false),
                                                                                                               ('Yahya', 'El Hadri', 'yahya@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000006', 'Barcelona', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953244/persona9_z9iuta.jpg', NOW(), NOW(), false),
                                                                                                               ('Samuel', 'Cortes', 'samu@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000007', 'Valencia', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953403/oersiba_byuy41.jpg', NOW(), NOW(), false),
                                                                                                               ('Javier', 'Hernandez', 'javi@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000008', 'Sevilla', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953492/asda_kccyvh.jpg', NOW(), NOW(), false),
                                                                                                               ('Javier', 'Ruiz', 'javierruiz@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000009', 'Bilbao', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953560/asdas_ru6fbr.jpg', NOW(), NOW(), false),
                                                                                                               ('Pedro', 'PicaPiedra', 'pedro@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000010', 'Zaragoza', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953596/dass_rxxcbn.jpg', NOW(), NOW(), false),
                                                                                                               ('Ruben', 'Gomez', 'ruben@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000011', 'Madrid', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953631/qwqw_xapz4n.jpg', NOW(), NOW(), false),
                                                                                                               ('Sergio', 'Peña', 'sergio@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000012', 'Barcelona', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953669/sadasas_d8cpe6.jpg', NOW(), NOW(), false),
                                                                                                               ('Victor', 'Conde', 'victor@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000013', 'Valencia', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953712/sasdasdasd_ybfown.jpg', NOW(), NOW(), false),
                                                                                                               ('Javier', 'Garzas', 'javiergarzas@example.com', '$2a$12$PFvGQIyLW.a2lKL2q8BLvOT1TAO6uGmYwRPxWaRVhIvFRT9ZOzF6W', '600000014', 'Sevilla', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764953782/asdasdq_bjhs57.jpg', NOW(), NOW(), false);

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

-- ==============================
-- TRABAJADORES
-- ==============================
INSERT INTO trabajador (id, user_id, numero_seguridad_social, created, updated, deleted) VALUES
                                                                                             (1, 2, 'SS001', NOW(), NOW(), false),
                                                                                             (2, 3, 'SS002', NOW(), NOW(), false),
                                                                                             (3, 4, 'SS003', NOW(), NOW(), false),
                                                                                             (4, 1, 'SS004', NOW(), NOW(), false);

INSERT INTO productos (nombre, tipo, imagen, descripcion, precio, stock, created, updated, is_deleted) VALUES
   ('Auriculares Gaming Xtreme 7.1', 'Auriculares', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764931124/auriculares_vzqsj1.jpg', 'Auriculares para gaming con sonido 7.1 envolvente y micrófono retráctil', 129.99, 50, NOW(), NOW(), false),
   ('Teclado Mecánico RGB Pro', 'Teclado', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764932818/teclado4_ztsldp.jpg', 'Teclado mecánico con switches táctiles, iluminación RGB personalizable', 89.95, 75, NOW(), NOW(), false),
   ('Ratón Inalámbrico UltraPrecision', 'Ratón', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764933011/raton2_plmzd5.jpg', 'Ratón inalámbrico para gaming y productividad con sensor de alta precisión', 59.99, 120, NOW(), NOW(), false),
   ('Monitor 27″ QHD 144 Hz', 'Monitor', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947358/monitor2_hqnuu9.jpg', 'Monitor de 27 pulgadas QHD con frecuencia de actualización de 144Hz y panel IPS', 299.90, 40, NOW(), NOW(), false),
   ('Tarjeta Gráfica RTX 4070 Ti', 'Tarjeta Gráfica', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947652/tarjetagrafica1_ghy4mo.jpg', 'Tarjeta gráfica de alto rendimiento RTX 4070 Ti para gaming y edición', 799.99, 15, NOW(), NOW(), false),
   ('Placa Base ATX Gaming Z790', 'Placa Base', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947920/placabase4_apgire.jpg', 'Placa base ATX con chipset Z790, preparada para Intel 14ª Gen', 249.50, 30, NOW(), NOW(), false),
   ('Memoria RAM DDR5 32 GB 6000MHz', 'RAM', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948156/ram1_mahewh.jpg', 'Kit de memoria DDR5‑6000 de 32 GB (2×16) para rendimiento extremo', 179.00, 65, NOW(), NOW(), false),
   ('SSD NVMe M.2 2 TB', 'SSD', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948184/ram4_e6kxam.jpg', 'Unidad SSD NVMe M.2 de 2TB con velocidades de lectura/escritura ultrarrápidas', 219.99, 45, NOW(), NOW(), false),
   ('Fuente de Alimentación 850 W Modular', 'Fuente', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948484/ssdd6_wp9dw6.jpg', 'Fuente de alimentación modular de 850 W, certificación 80+ Gold', 139.95, 35, NOW(), NOW(), false),
   ('Refrigeración Líquida AIO 240mm', 'Refrigeración', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948669/ventilador1_hsnunp.webp', 'Sistema de refrigeración líquida AIO de 240mm para disipación eficiente', 109.90, 25, NOW(), NOW(), false),
   ('Caja PC Mid‑Tower RGB', 'Caja PC', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948777/caja1_evgp1w.jpg', 'Caja para PC tipo mid‑tower con iluminación RGB integrada y panel de vidrio templado', 89.99, 50, NOW(), NOW(), false),
   ('Monitor Curvo 34″ Ultrawide', 'Monitor', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947348/monitor3_vkectb.avif', 'Monitor curvo de 34″ ultrawide 3440×1440 para productividad y gaming inmersivo', 449.00, 20, NOW(), NOW(), false),
   ('Kit Teclado + Ratón Inalámbrico', 'Kit Periféricos', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764933017/raton1_jtw8wd.webp', 'Pack completado con teclado y ratón inalámbricos para oficina o gaming casual', 74.99, 80, NOW(), NOW(), false),
   ('Webcam Full HD 1080p', 'Webcam', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948862/webcam1_e6wkot.jpg', 'Webcam Full HD 1080p con micrófono incorporado para streaming', 49.99, 90, NOW(), NOW(), false),
   ('Micrófono USB Condensador', 'Micrófono', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948964/micrfono3_xhaujd.webp', 'Micrófono USB de condensador para streaming, podcast y grabación', 59.50, 60, NOW(), NOW(), false),
   ('Auriculares Bluetooth Cancelación Ruido', 'Auriculares', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764932336/auricularesdiadema_yh0ne8.avif', 'Auriculares Bluetooth con cancelación activa de ruido y carga rápida', 99.99, 55, NOW(), NOW(), false),
   ('Monitor Gaming 24″ 165Hz', 'Monitor', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947330/monitor4_mgcfqo.jpg', 'Monitor para gaming de 24″ con frecuencia de actualización de 165Hz y tiempo de respuesta 1ms', 219.90, 45, NOW(), NOW(), false),
   ('Tarjeta Gráfica RTX 4060 Super', 'Tarjeta Gráfica', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947660/tarjetagrafica3_dnxdcv.jpg', 'Tarjeta gráfica RTX 4060 Super para 1080p / 1440p fluido', 549.00, 18, NOW(), NOW(), false),
   ('Placa Base Micro‑ATX B660', 'Placa Base', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947914/placabase2_fjfgqp.webp', 'Placa base Micro‑ATX con chipset B660, compatible Intel 13ª/14ª Gen', 159.00, 40, NOW(), NOW(), false),
   ('Memoria RAM DDR4 16 GB 3200MHz', 'RAM', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948164/ram2_gldepf.jpg', 'Kit de memoria DDR4‑3200 de 16 GB (2×8) para sistemas más económicos', 69.99, 110, NOW(), NOW(), false),
   ('SSD SATA 1 TB', 'SSD', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948399/ssd1_mojhm9.avif', 'Unidad SSD SATA de 1TB para mejorar rendimiento general del sistema', 109.99, 70, NOW(), NOW(), false),
   ('Unidad Externa HDD 4 TB USB‑C', 'Disco Externo', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764949165/disco_rcai7w.webp', 'Disco duro externo de 4TB con conexión USB‑C para almacenamiento adicional', 119.90, 65, NOW(), NOW(), false),
   ('Sistema Altavoces 2.1 Inalámbricos', 'Altavoces', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764949029/altavoces_xqi3r0.jpg', 'Sistema de altavoces inalámbricos 2.1 con subwoofer para entretenimiento multimedia', 79.95, 80, NOW(), NOW(), false),
   ('Silla Gaming Ergonomica', 'Silla', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764949068/silla_xsa2vy.jpg', 'Silla ergonómica para gaming con respaldo alto, reposabrazos ajustable y ruedas', 189.00, 22, NOW(), NOW(), false),
   ('Kit Refrigeración por Aire CPU', 'Refrigeración', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948678/ventilador2_uime5b.jpg', 'Cooler de aire de alto rendimiento para CPU con ventilador RGB', 49.99, 100, NOW(), NOW(), false),
   ('Tarjeta de Sonido Externa USB', 'Tarjeta de Sonido', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764949110/tarjetadesonid_njlesr.jpg', 'Tarjeta de sonido externa USB para mejorar la calidad de audio en PC', 89.90, 30, NOW(), NOW(), false),
   ('Micrófono de Brazo para Streaming', 'Micrófono', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948959/micrfono2_fmok2m.jpg', 'Micrófono profesional con brazo articulado para streaming y podcasts', 69.95, 40, NOW(), NOW(), false),
   ('Teclado Mecánico Compacto 65%', 'Teclado', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764932745/teclado3_bli0t3.jpg', 'Teclado mecánico compacto 65% con iluminación RGB y switch rojo silencioso', 99.99, 50, NOW(), NOW(), false),
   ('Ratón Gaming Óptico 12 000 DPI', 'Ratón', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764933006/raton3_ohtlbm.jpg', 'Ratón óptico gaming con sensor de 12 000 DPI y diseño ambidiestro ligero', 79.90, 60, NOW(), NOW(), false),
   ('Auriculares Over‑Ear para Creación', 'Auriculares', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764932512/gamigncascos_pbk4ik.jpg', 'Auriculares over‑ear con sonido referencia para edición de audio y vídeo', 129.00, 35, NOW(), NOW(), false),
   ('Monitor 32″ 4K IPS', 'Monitor', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947319/monitor5_f7k1fq.jpg', 'Monitor de 32″ con resolución 4K y panel IPS para edición gráfica y productividad', 499.99, 10, NOW(), NOW(), false),
   ('Tarjeta Gráfica RX 7900 XT', 'Tarjeta Gráfica', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947673/tarjetagrafica2_axzmvn.jpg', 'Tarjeta gráfica AMD RX 7900 XT para gaming 4K y edición profesional', 899.00, 12, NOW(), NOW(), false),
   ('Placa Base ITX B550 WiFi', 'Placa Base', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947902/placabase3_fzsher.jpg', 'Placa base ITX con chipset B550 y WiFi integrado para mini‑PCs', 179.00, 28, NOW(), NOW(), false),
   ('Memoria RAM DDR4 32 GB 3600MHz', 'RAM', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948172/ram3_hlvnox.jpg', 'Kit de memoria DDR4‑3600 de 32 GB para sistemas gaming de gama media', 149.99, 55, NOW(), NOW(), false),
   ('SSD NVMe M.2 1 TB', 'SSD', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948402/ss2_rhzpqg.jpg', 'Unidad SSD NVMe M.2 de 1TB para cargas rápidas de sistema y juegos', 129.99, 90, NOW(), NOW(), false),
   ('Fuente de Alimentación 1000 W 80+ Platinum', 'Fuente', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948546/fuente2_mwa3su.jpg', 'Fuente de alimentación 1000 W certificación 80+ Platinum para rigs exigentes', 219.99, 18, NOW(), NOW(), false),
   ('Caja PC Full‑Tower RGB', 'Caja PC', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948781/caja2_iadryj.jpg', 'Caja PC full‑tower con iluminación RGB completa, depósito externo y panel de vidrio templado', 159.99, 22, NOW(), NOW(), false),
   ('Monitor 27″ Curvo 165Hz QHD', 'Monitor', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947311/monitor6_kfhynv.webp', 'Monitor de 27″ curvo QHD con 165Hz y tecnología FreeSync/G‑Sync', 339.95, 30, NOW(), NOW(), false),
   ('Webcam 4K UHD', 'Webcam', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948872/webcam2_zq9kv4.webp', 'Webcam 4K UHD con auto‑enfoque y micrófono dual para streaming profesional', 99.99, 40, NOW(), NOW(), false),
   ('Micrófono Lavalier Inalámbrico', 'Micrófono', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948950/micrfono1_a3s47h.jpg', 'Micrófono inalámbrico tipo lavalier para grabación móvil y vlogging', 49.99, 80, NOW(), NOW(), false),
   ('Auriculares Gaming In‑Ear RTP', 'Auriculares', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764932602/auricularesraros_btnhzx.jpg', 'Auriculares in‑ear gaming con cable extra‑ligero y micrófono extraíble', 59.99, 70, NOW(), NOW(), false),
   ('Teclado Ergonomico Dividido Bluetooth', 'Teclado', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764932739/teclado_apelgy.jpg', 'Teclado ergonómico dividido inalámbrico Bluetooth para escritura cómoda', 119.95, 34, NOW(), NOW(), false),
   ('Ratón Vertical Inalámbrico Ergonómico', 'Ratón', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764933154/raton4_amttft.jpg', 'Ratón vertical inalámbrico ergonómico para prevenir tensión en la muñeca', 69.90, 50, NOW(), NOW(), false),
   ('Placa Base XL‑ATX Gaming M.2', 'Placa Base', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947893/placabase1_jbbfhs.jpg', 'Placa base XL‑ATX de gama alta con múltiples ranuras M.2 y soporte SLI', 329.00, 14, NOW(), NOW(), false),
   ('Tarjeta Gráfica RTX 4080 Super', 'Tarjeta Gráfica', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947683/tarjetagrafica4_in8sov.jpg', 'Tarjeta gráfica RTX 4080 Super para gaming 4K/8K y creación de contenido', 1199.99, 8, NOW(), NOW(), false),
   ('Memoria RAM DDR5 64 GB 7200MHz', 'RAM', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948184/ram4_e6kxam.jpg', 'Kit de memoria DDR5‑7200 de 64 GB (2×32) para estaciones de trabajo y gaming extremo', 349.99, 20, NOW(), NOW(), false),
   ('SSD NVMe M.2 4 TB', 'SSD', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948484/ssdd6_wp9dw6.jpg', 'Unidad SSD NVMe M.2 de 4TB para almacenamiento ultra elevado', 499.99, 12, NOW(), NOW(), false),
   ('Kit Ventilación RGB PC 5 Ventiladores', 'Refrigeración', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948681/ventilador3_cw9o6g.jpg', 'Kit de 5 ventiladores RGB para caja PC, flujo alto de aire y estética gaming', 39.99, 130, NOW(), NOW(), false),
   ('Base Refrigerante Notebook 17″', 'Refrigeración', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764948684/ventilador4_rjcxaj.jpg', 'Base refrigerante para notebook hasta 17″ con iluminación LED azul y ventiladores duales', 29.99, 110, NOW(), NOW(), false),
   ('Monitor Portátil 15.6″ USB‑C', 'Monitor', 'https://res.cloudinary.com/dkaxfqkvo/image/upload/v1764947303/monitor_etlx3i.avif', 'Monitor portátil 15.6″ con conexión USB‑C, ideal para movilidad', 209.90, 37, NOW(), NOW(), false);


-- PEDIDOS DE EJEMPLO (clientes 1 a 10)
INSERT INTO pedido (id, cliente_id, estado, fecha, created, updated, deleted) VALUES
  (4, 1, 'PENDIENTE', NOW(), NOW(), NOW(), false),
  (5, 1, 'PREPARACION', NOW(), NOW(), NOW(), false),
  (6, 3, 'ENVIADO', NOW(), NOW(), NOW(), false),
  (7, 3, 'ENTREGADO', NOW(), NOW(), NOW(), false),
  (8, 4, 'PENDIENTE', NOW(), NOW(), NOW(), false),
  (9, 4, 'ENVIADO', NOW(), NOW(), NOW(), false),
  (10, 5, 'PREPARACION', NOW(), NOW(), NOW(), false),
  (11, 5, 'ENTREGADO', NOW(), NOW(), NOW(), false),
  (12, 6, 'PENDIENTE', NOW(), NOW(), NOW(), false),
  (13, 7, 'ENVIADO', NOW(), NOW(), NOW(), false),
  (14, 7, 'PREPARACION', NOW(), NOW(), NOW(), false),
  (15, 8, 'ENTREGADO', NOW(), NOW(), NOW(), false),
  (16, 9, 'PENDIENTE', NOW(), NOW(), NOW(), false),
  (17, 10, 'ENVIADO', NOW(), NOW(), NOW(), false),
  (18, 10, 'PREPARACION', NOW(), NOW(), NOW(), false),
  (19, 1, 'PREPARACION', NOW(), NOW(), NOW(), false);

-- LINEAS DE VENTA DE EJEMPLO
SELECT setval('pedido_id_seq', (SELECT MAX(id) FROM pedido));

-- Ajustar secuencia de pedido_id y linea_venta_id
SELECT setval('linea_venta_id_seq', (SELECT MAX(id) FROM linea_venta));

INSERT INTO linea_venta (pedido_id, producto_id, cantidad, precio_unitario) VALUES
    (4, 1, 1, 129.99),
    (4, 2, 1, 89.95),
    (5, 3, 2, 59.99),
    (6, 4, 1, 299.90),
    (6, 5, 1, 799.99),
    (7, 6, 1, 249.50),
    (7, 7, 2, 179.00),
    (8, 8, 1, 219.99),
    (9, 9, 1, 139.95),
    (10, 10, 1, 109.90),
    (11, 11, 2, 89.99),
    (12, 12, 1, 449.00),
    (13, 13, 1, 74.99),
    (14, 14, 3, 49.99),
    (15, 15, 1, 59.50),
    (16, 16, 1, 99.99),
    (17, 17, 2, 219.90),
    (18, 18, 1, 549.00),
    (19, 18, 6, 249.50);


-- Ajustar secuencia para evitar conflictos con ID ya existentes
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Ajustar secuencia para evitar conflictos con IDs ya existentes en "trabajador"
SELECT setval('trabajador_id_seq', (SELECT MAX(id) FROM trabajador));

-- Ajustar secuencia para evitar conflictos con IDs ya existentes en "cliente"
SELECT setval('cliente_id_seq', (SELECT MAX(id) FROM cliente));





