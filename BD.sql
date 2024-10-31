-- Eliminar tablas en el orden correcto
DROP TABLE IF EXISTS rols_permissions CASCADE;
DROP TABLE IF EXISTS rols CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS labs CASCADE;
DROP TABLE IF EXISTS presentation CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS apis CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS seat_type CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS movement_types CASCADE;
DROP TABLE IF EXISTS request_types CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;

-- Crear tipo de sede
CREATE TABLE seat_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1,  -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar tipos de sede posibles
INSERT INTO seat_type (name) VALUES ('Oficina'), ('Almacen'), ('Bodega');;

-- Crear el area
CREATE TABLE section (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1,  -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar areas posibles
INSERT INTO section (name) VALUES ('Externa'), ('Administrador'), ('Sistemas'), ('Contabilidad'), ('Quirófanos'); --Cuando es externa es porque es un cliente(paciente)

-- Crear roles
CREATE TABLE rols (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles posibles
INSERT INTO rols (name) VALUES ('Administrador'), ('Cliente'), ('Farmaceutico'), ('Médico'), ('Enfermera'), ('Especialista'), ('Coordinador de Atención al Paciente'), ('Facturación y Cobranza'), ('Recursos Humanos'), ('Técnico de Laboratorio'), ('Radiólogo'), ('Nutricionista');

-- Crear permisos
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear el permiso del rol
CREATE TABLE rols_permissions (
    id SERIAL PRIMARY KEY,
    rols_id INT REFERENCES rols(id) NOT NULL,
    permissions_id INT REFERENCES permissions(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (rols_id, permissions_id)
);

-- Crear usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- ID único para cada usuario
    dni BIGINT NOT NULL UNIQUE,  -- Documento de identidad
    name VARCHAR(250) NOT NULL,  -- Nombre completo del usuario
    lastname VARCHAR(250) NOT NULL,  -- Apellido completo del usuario
    image VARCHAR(250) DEFAULT NULL,  -- Ruta de la imagen de perfil del usuario
    address VARCHAR(300) DEFAULT NULL,  -- Dirección del usuario
    phone1 BIGINT DEFAULT NULL,  -- Teléfono principal
    phone2 BIGINT DEFAULT NULL,  -- Teléfono secundario
    section_id INTEGER REFERENCES section(id) NOT NULL DEFAULT 1,  -- Referencia a la tabla de áreas
    email VARCHAR(250) NOT NULL,  -- Correo electrónico del usuario
    role_id INTEGER REFERENCES rols(id) NOT NULL DEFAULT 2,  -- Referencia a la tabla de roles
    password VARCHAR(300) DEFAULT NULL,  -- Contraseña encriptada del usuario
    status SMALLINT DEFAULT 1,  -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    access SMALLINT DEFAULT 1,  -- Acceso (1: true, 0: false)
    token VARCHAR(300) DEFAULT NULL,  -- Token de verificación de la cuenta
    expire_token TIMESTAMP DEFAULT NULL,  -- Fecha de expiración del token
    -- forget SMALLINT DEFAULT 0,  -- Solicitud de restablecimiento de contraseña (1: solicitado, 0: no solicitado)
    verificated SMALLINT DEFAULT 0,  -- Verificación del usuario (1: verificado, 0: no verificado)
    login_status SMALLINT DEFAULT 1,  -- Estado de login (0: sin login, 1: logueado)
    patient_status SMALLINT DEFAULT 1,  -- Estado del paciente (0: Inhabilitado, 1: Habilitado)
    status_forget SMALLINT DEFAULT 0,  -- Estado de solicitud de restablecimiento de contraseña (1: solicitado, 0: no solicitado),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación del usuario
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de última actualización
    
    CONSTRAINT unique_email UNIQUE (email),  -- Restricción para asegurar que los correos no se repitan
    CONSTRAINT unique_dni UNIQUE (dni)  -- Restricción para asegurar que los DNI no se repitan
);

INSERT INTO users (dni, section_id, name, role_id, lastname, email, password) VALUES (0000000000000, 2, 'Super', 1, 'Admin', 'admin@oneurosas.com.co', '$2a$10$ADHAy5hWVqj1JuoBUJBoPeKBsCkw6b3iddhsbBpkO8/vJZ.llH/Ry'); -- Coneusos@s

-- Crear Sedes
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    id_charge_of INTEGER REFERENCES users(id) NOT NULL,
    id_seat_type INTEGER REFERENCES seat_type(id) NOT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_seat UNIQUE (name)
);

-- Crear estados
CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1,  -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar estados posibles para solicitudes y devoluciones
INSERT INTO statuses (name, created_id, updated_id) VALUES ('pendiente', 1, 1), ('aprobado', 1, 1), ('entregado', 1, 1), ('despachado', 1, 1), ('cancelado', 1, 1);

-- Crear bodegas
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    id_seats INTEGER REFERENCES seats(id) NOT NULL,
    id_charge_of INTEGER REFERENCES users(id) NOT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorias posibles
INSERT INTO categories (name) VALUES ('Medicamenteos'), ('Dispositivos e insumos medicos');

-- Crear laboratorios
CREATE TABLE labs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear presentacion comercial
CREATE TABLE presentation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar presentaciones posibles
INSERT INTO presentation (name) VALUES ('Ampolla'), ('Tableta'), ('Solucion'), ('Antiseptico'), ('Gotas ofmatalmicas');

-- Crear unidad de medida
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar unidades posibles
INSERT INTO units (name) VALUES ('Cajas'), ('Frascos'), ('Unidades'), ('ML'), ('MG/ML'), ('UI/ML'), ('G');

-- Crear principio activo productos
CREATE TABLE apis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar unidades posibles
INSERT INTO apis (name) VALUES ('No aplica'), ('AGUA OXIGENADA'), ('ACIDO VALPROICO'), ('AMIODARONA'), ('ALCOHOL'), ('BETAMETILDIGOXINA'), ('DEXAMETASONA'), ('NALOXONA'), ('KETAMINA'), ('FENITOINA'), ('FLUMAZENIL');

-- Crear proveedores
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    dni VARCHAR(100),
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    commercial_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    description TEXT NULL,
    brand VARCHAR(100),
    presentation_id INTEGER REFERENCES presentation(id), 
    barcode VARCHAR(50) UNIQUE,
    id_api INTEGER REFERENCES apis(id) DEFAULT 1, -- Principio activo 
    labs_id INTEGER REFERENCES labs(id),
    dosage VARCHAR(250) DEFAULT 'No aplica', --- La concentracion del producto
    category_id INTEGER REFERENCES categories(id), -- El tipo de producto(Medicamento o Insumo)
    temperature VARCHAR(250),
    sanitary_registration VARCHAR(50),
    Caliber VARCHAR(50) DEFAULT 'No aplica', -- El calibre
    unit_price NUMERIC(20, 3),
    unit_id INTEGER REFERENCES units(id),
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    batch VARCHAR(50), --- El lote
    expiration_date DATE,
    shelf_life VARCHAR(50),
    IVA NUMERIC(3, 2) DEFAULT 0, -- IVA in percentage (de 0 a 1)
    risk VARCHAR(50),
    ium_code1 VARCHAR(50),
    ium_code2 VARCHAR(50),
    ium_code3 VARCHAR(50),
    notes TEXT, --- Estas son observaciones
    cums_code VARCHAR(50),
    supplier_id INTEGER REFERENCES suppliers(id), -- Este es el proveedor
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear inventarios
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id), 
    warehouse_id INTEGER REFERENCES warehouses(id), 
    quantity INTEGER NOT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tipos de movimiento(inventarios)
CREATE TABLE movement_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar posibles tipos de movimiento en inventario
INSERT INTO movement_types (name) VALUES ('Entrada'), ('Salida'), ('Transferencia');

-- Crear compra (entradas de productos)
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id), 
    entry_date DATE NOT NULL, -- Fecha de ingreso del producto
    invoice VARCHAR(200) NOT NULL, -- Numero de factura
    quantity INTEGER NOT NULL,
    iva NUMERIC(3, 2) DEFAULT 0, 
    total NUMERIC(20, 3) NOT NULL,    
    movement_type_id INTEGER REFERENCES movement_types(id), 
    status_id INTEGER REFERENCES statuses(id) DEFAULT 1,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tipo de requerimiento
CREATE TABLE request_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar tipo de requerimiento
INSERT INTO request_types (name) VALUES ('area'), ('paciente');

-- Create requerimientos
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status_id INTEGER REFERENCES statuses(id) DEFAULT 1,  
    request_type_id INTEGER REFERENCES request_types(id),
    reason TEXT,
    quantity INTEGER NOT NULL,
    product_id INTEGER REFERENCES products(id), 
    created_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    updated_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);