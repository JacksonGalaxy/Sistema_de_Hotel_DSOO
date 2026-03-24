-- ==============================================================================
-- 1. CATÁLOGOS BASE Y SEGURIDAD (Jerarquía de Usuarios y Clientes)
-- ==============================================================================

CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE TiposCliente (
    id_tipo_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    nivel_prioridad INT NOT NULL -- Ej: 1=Estandar, 2=Premium, 3=VIP
);

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    id_tipo_cliente INT NULL, -- Solo aplica si el rol es 'Cliente'
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    FOREIGN KEY (id_tipo_cliente) REFERENCES TiposCliente(id_tipo_cliente)
);

CREATE TABLE Membresias (
    id_membresia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('Activa', 'Vencida', 'Cancelada') DEFAULT 'Activa',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- ==============================================================================
-- 2. MÓDULO DE ALOJAMIENTOS Y RESERVAS PRINCIPALES
-- ==============================================================================

CREATE TABLE CategoriasAlojamiento (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    estancia_minima INT DEFAULT 1, -- Las villas tendrán '2' aquí
    requiere_nivel_cliente INT DEFAULT 1 -- Nivel de TiposCliente requerido
);

CREATE TABLE Alojamientos (
    id_alojamiento INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    numero_identificador VARCHAR(20) NOT NULL UNIQUE,
    capacidad_maxima INT NOT NULL,
    precio_por_noche DECIMAL(10, 2) NOT NULL,
    estado ENUM('Disponible', 'Ocupado', 'Mantenimiento') DEFAULT 'Disponible',
    FOREIGN KEY (id_categoria) REFERENCES CategoriasAlojamiento(id_categoria)
);

CREATE TABLE ReservasHospedaje (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_alojamiento INT NOT NULL,
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    numero_adultos INT NOT NULL DEFAULT 1,
    numero_ninos INT NOT NULL DEFAULT 0,
    costo_total DECIMAL(10, 2) NOT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'Check-In', 'Check-Out', 'Cancelada') DEFAULT 'Pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_alojamiento) REFERENCES Alojamientos(id_alojamiento)
);

CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('Tarjeta', 'Efectivo', 'Transferencia') NOT NULL,
    estado_pago ENUM('Pendiente', 'Completado', 'Rechazado', 'Reembolsado') DEFAULT 'Completado',
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES ReservasHospedaje(id_reserva) ON DELETE CASCADE
);

-- ==============================================================================
-- 3. MÓDULO DE AMENIDADES DINÁMICAS
-- ==============================================================================

CREATE TABLE Amenidades (
    id_amenidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidad_maxima INT NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    id_nivel_cliente_requerido INT NOT NULL,
    FOREIGN KEY (id_nivel_cliente_requerido) REFERENCES TiposCliente(id_tipo_cliente)
);

CREATE TABLE ReservasAmenidad (
    id_reserva_amenidad INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_amenidad INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('Activa', 'Completada', 'Cancelada') DEFAULT 'Activa',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_amenidad) REFERENCES Amenidades(id_amenidad)
);

-- ==============================================================================
-- 4. MÓDULO DE RESTAURANTE
-- ==============================================================================

CREATE TABLE Restaurantes (
    id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad_maxima INT NOT NULL
);

CREATE TABLE TurnosComida (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    id_restaurante INT NOT NULL,
    fecha DATE NOT NULL,
    tipo_turno ENUM('Desayuno', 'Comida', 'Cena') NOT NULL,
    capacidad_disponible INT NOT NULL,
    FOREIGN KEY (id_restaurante) REFERENCES Restaurantes(id_restaurante)
);

CREATE TABLE ReservasRestaurante (
    id_reserva_rest INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_turno INT NOT NULL,
    numero_comensales INT NOT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'En_Uso', 'Finalizada', 'Cancelada') DEFAULT 'Pendiente',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_turno) REFERENCES TurnosComida(id_turno)
);

-- ==============================================================================
-- 5. MÓDULO DE KIDS CLUB
-- ==============================================================================

CREATE TABLE ActividadesKidsClub (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad_minima INT NOT NULL,
    edad_maxima INT NOT NULL,
    capacidad_disponible INT NOT NULL,
    fecha_hora_inicio DATETIME NOT NULL
);

CREATE TABLE InscripcionesNino (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_actividad INT NOT NULL,
    id_tutor INT NOT NULL,
    nombre_nino VARCHAR(100) NOT NULL,
    edad_nino INT NOT NULL,
    hora_entrada DATETIME NULL,
    hora_salida DATETIME NULL,
    estado ENUM('Registrada', 'En_Curso', 'Finalizada', 'Cancelada') DEFAULT 'Registrada',
    FOREIGN KEY (id_actividad) REFERENCES ActividadesKidsClub(id_actividad),
    FOREIGN KEY (id_tutor) REFERENCES Usuarios(id_usuario)
);

-- ==============================================================================
-- 6. AUDITORÍA Y BITÁCORA
-- ==============================================================================

CREATE TABLE RegistroAuditoria (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL, 
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES (SEMILLAS)
-- ==============================================================================

-- Poblar Catálogo de Roles
INSERT INTO Roles (nombre) VALUES 
('Administrador'),
('Gerente'),
('Recepcionista'),
('Cliente');

-- Poblar Catálogo de Tipos de Cliente
INSERT INTO TiposCliente (nombre, nivel_prioridad) VALUES 
('Estandar', 1),
('Premium', 2),
('VIP', 3);

-- Crear un usuario Administrador por defecto
INSERT INTO Usuarios (id_rol, id_tipo_cliente, nombre_completo, email, password_hash, telefono) VALUES
(1, NULL, 'Admin Sistema', 'admin@hoteldsoo.com', 'has_temporal_123', '555-1234');