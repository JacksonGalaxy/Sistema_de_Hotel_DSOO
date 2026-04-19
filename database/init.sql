-- ==============================================================================
-- SISTEMA DE GESTIÓN HOTELERA
-- Base de Datos sincronizada con Diagrama de Clases (XML/Draw.io)
-- Creación inicial
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEGURIDAD Y ACCESO (Clases: Rol, Permiso, Usuario)
-- ------------------------------------------------------------------------------

CREATE TABLE Rol (
    id_rol      INT          AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE Permiso (
    id_permiso INT          AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    recurso    VARCHAR(100) NOT NULL,
    accion     VARCHAR(100) NOT NULL
);

-- Tabla intermedia para la relación muchos a muchos entre Rol y Permiso
CREATE TABLE Rol_Permiso (
    id_rol     INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol)     REFERENCES Rol(id_rol)         ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso) ON DELETE CASCADE
);

CREATE TABLE Usuario (
    id_usuario         INT          AUTO_INCREMENT PRIMARY KEY,
    id_rol             INT          NOT NULL,
    nombre_completo    VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash    VARCHAR(255) NOT NULL,
    activo             BOOLEAN      NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- ------------------------------------------------------------------------------
-- 2. CLIENTES Y FIDELIZACIÓN (Clases: Cliente, Membresia, Beneficio)
-- ------------------------------------------------------------------------------

CREATE TABLE Cliente (
    id_cliente               INT          AUTO_INCREMENT PRIMARY KEY,
    numero_cliente           VARCHAR(20)  NOT NULL UNIQUE,
    nombre_completo          VARCHAR(150) NOT NULL,
    correo_electronico       VARCHAR(100) NOT NULL UNIQUE,
    telefono                 VARCHAR(20),
    documento_identificacion VARCHAR(50),
    direccion                VARCHAR(255),
    tipo_cliente             ENUM('ESTANDAR', 'PREMIUM', 'VIP') NOT NULL DEFAULT 'ESTANDAR',
    fecha_registro           DATE         NOT NULL
);

CREATE TABLE Membresia (
    id_membresia INT           AUTO_INCREMENT PRIMARY KEY,
    id_cliente   INT           NOT NULL,
    plan_meses   INT           NOT NULL,
    fecha_inicio DATE          NOT NULL,
    fecha_fin    DATE          NOT NULL,
    estado       ENUM('ACTIVA', 'VENCIDA', 'CANCELADA') NOT NULL DEFAULT 'ACTIVA',
    costo_total  DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE Beneficio (
    id_beneficio         INT          AUTO_INCREMENT PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    descripcion          TEXT,
    tipo_cliente         ENUM('ESTANDAR', 'PREMIUM', 'VIP') NOT NULL,
    acceso_villas        BOOLEAN      NOT NULL DEFAULT FALSE,
    tipo_amenidades      VARCHAR(100),
    prioridad_reserva    VARCHAR(100),
    politica_cancelacion VARCHAR(255)
);

-- ------------------------------------------------------------------------------
-- 3. OPERACIONES Y LOGS (Clases: Notificacion, RegistroAuditoria)
-- ------------------------------------------------------------------------------

CREATE TABLE Notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario      INT NULL,
    id_cliente      INT NULL,
    tipo            ENUM('CORREO', 'SISTEMA', 'PUSH') NOT NULL,
    asunto          VARCHAR(200) NOT NULL,
    mensaje         TEXT NOT NULL,
    destinatario    VARCHAR(100) NOT NULL,
    fecha_envio     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    enviada         BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE RegistroAuditoria (
    id_registro      INT          AUTO_INCREMENT PRIMARY KEY,
    fecha_hora       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion           VARCHAR(100) NOT NULL,
    entidad_afectada VARCHAR(100) NOT NULL,
    id_entidad       INT          NOT NULL,
    descripcion      TEXT,
    ip_origen        VARCHAR(45)
);

-- ------------------------------------------------------------------------------
-- 4. GESTIÓN DE HOSPEDAJE (Clases: Alojamiento, Reserva, Pago)
-- ------------------------------------------------------------------------------

CREATE TABLE Alojamiento (
    id_alojamiento   INT AUTO_INCREMENT PRIMARY KEY,
    numero_o_nombre  VARCHAR(50) NOT NULL UNIQUE,
    tipo             ENUM('HABITACION_ESTANDAR', 'HABITACION_DELUXE', 'SUITE', 'VILLA_PREMIUM') NOT NULL,
    estado           ENUM('DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_LIMPIEZA', 'MANTENIMIENTO', 'NO_MOLESTAR', 'INACTIVA') NOT NULL DEFAULT 'DISPONIBLE',
    capacidad_maxima INT NOT NULL,
    precio_base      DECIMAL(10,2) NOT NULL,
    descripcion      TEXT
);

CREATE TABLE Reserva (
    id_reserva       INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente       INT NOT NULL,
    id_alojamiento   INT NOT NULL,
    fecha_reserva    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_checkin    DATE NOT NULL,
    fecha_checkout   DATE NOT NULL,
    estado           ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    numero_huespedes INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_alojamiento) REFERENCES Alojamiento(id_alojamiento) ON DELETE CASCADE
);

CREATE TABLE Pago (
    id_pago       INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva    INT NOT NULL,
    monto         DECIMAL(10,2) NOT NULL,
    fecha_pago    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago   ENUM('EFECTIVO', 'TARJETA_CREDITO') NOT NULL,
    estado_pago   ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
    referencia    VARCHAR(100),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 5. AMENIDADES Y SERVICIOS (Clases: AreaAmenidad, ServicioRestaurante)
-- ------------------------------------------------------------------------------

CREATE TABLE AreaAmenidad (
    id_area          INT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    tipo             ENUM('SPA', 'GIMNASIO', 'PISCINA', 'CLASE_WELLNESS', 'KIDS_CLUB', 'RESTAURANTE') NOT NULL,
    estado           ENUM('DISPONIBLE', 'EN_MANTENIMIENTO', 'LIMPIEZA_PROFUNDA', 'BLOQUEADA') NOT NULL DEFAULT 'DISPONIBLE',
    capacidad_maxima INT NOT NULL
);

CREATE TABLE ServicioRestaurante (
    id_servicio   INT AUTO_INCREMENT PRIMARY KEY,
    id_area       INT NOT NULL,
    turno         ENUM('DESAYUNO', 'COMIDA', 'CENA') NOT NULL,
    tipo_servicio ENUM('BUFFET', 'A_LA_CARTA') NOT NULL,
    FOREIGN KEY (id_area) REFERENCES AreaAmenidad(id_area) ON DELETE CASCADE
);
