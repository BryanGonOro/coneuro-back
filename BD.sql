-- Eliminar tablas en el orden correcto
DROP TABLE IF EXISTS roles_permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS labs CASCADE;
DROP TABLE IF EXISTS presentation CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS apis CASCADE;
DROP TABLE IF EXISTS product_pricing CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS seat_type CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS movement_types CASCADE;
DROP TABLE IF EXISTS company_movements CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS company_movements_detail CASCADE;

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
INSERT INTO seat_type (name) VALUES ('Oficina Administrativa'), ('Consultorios'), ('Laboratorios Clínico'), ('Cirugías/Quirófano'), ('Unidad de Terapia Intensiva'), ('Bodega de Almacén Médico');

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
INSERT INTO section (name) VALUES ('Externa (Pacientes)'), ('Administrador'), ('Sistemas'), ('Contabilidad'), ('Quirófanos'); --Cuando es externa es porque es un cliente(paciente)

-- Crear roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Insertar roles posibles
INSERT INTO roles (name) VALUES ('Administrador'), ('Paciente'), ('Farmaceutico'), ('Médico'), ('Enfermera'), ('Especialista'), ('Coordinador de Atención al Paciente'), ('Facturación y Cobranza'), ('Recursos Humanos'), ('Técnico de Laboratorio'), ('Radiólogo'), ('Nutricionista');

-- Crear permisos
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Crear el permiso del rol
CREATE TABLE roles_permissions (
    id SERIAL PRIMARY KEY,
    fk_id_roles INT REFERENCES roles(id) ON DELETE CASCADE NOT NULL ,
    fk_id_permissions INT REFERENCES permissions(id) ON DELETE CASCADE NOT NULL ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    UNIQUE (fk_id_roles, fk_id_permissions)
);

-- Crear usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- ID único para cada usuario
    dni BIGINT NOT NULL UNIQUE,  -- Documento de identidad
    name VARCHAR(250) NOT NULL,  -- Nombre completo del usuario
    lastname VARCHAR(250) NOT NULL,  -- Apellido completo del usuario
    image VARCHAR(250) DEFAULT NULL,  -- Ruta de la imagen de perfil del usuario
    address VARCHAR(300) DEFAULT NULL,  -- Dirección del usuario
    phone1 VARCHAR(100) DEFAULT NULL,  -- Teléfono principal
    phone2 VARCHAR(100) DEFAULT NULL,  -- Teléfono secundario
    fk_id_section INTEGER REFERENCES section(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,  -- Referencia a la tabla de áreas
    email VARCHAR(250) NOT NULL,  -- Correo electrónico del usuario
    fk_id_role INTEGER REFERENCES roles(id) ON DELETE RESTRICT NOT NULL DEFAULT 2 ,  -- Referencia a la tabla de roles
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,  -- Fecha de última actualización
    
    CONSTRAINT unique_email UNIQUE (email),  -- Restricción para asegurar que los correos no se repitan
    CONSTRAINT unique_dni UNIQUE (dni)  -- Restricción para asegurar que los DNI no se repitan
);

INSERT INTO users (dni, fk_id_section, name, fk_id_role, lastname, email, password) VALUES (0000000000000, 2, 'Super', 1, 'Admin', 'admin@coneurosas.com.co', '$2a$10$1jeJCBwpiKTRx0zB4aWbNuhCgPjs0OPXuiAWUlw/AVheY3aCrCjo2'); -- Coneusos@s

-- Crear Sedes
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    fk_id_charge_of INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL ,
    fk_id_seat_type INTEGER REFERENCES seat_type(id) ON DELETE RESTRICT NOT NULL ,
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id)  ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,

    CONSTRAINT unique_seat UNIQUE (name)
);

-- Crear estados del documento(proceso)
CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1,  -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Insertar estados posibles para solicitudes y devoluciones
INSERT INTO statuses (name, created_by, updated_by) VALUES ('pendiente', 1, 1), ('aprobado', 1, 1), ('entregado', 1, 1), ('despachado', 1, 1), ('cancelado', 1, 1);

-- Crear bodegas
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    fk_id_seats INTEGER REFERENCES seats(id) NOT NULL,
    fk_id_charge_of INTEGER REFERENCES users(id) NOT NULL,
    open_date DATE, -- Fecha en que se abrió la bodega
    last_closed_date DATE, -- Fecha en que se cerró la bodega por última vez
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Crear categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
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
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Crear presentacion comercial
CREATE TABLE presentation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
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
    cod_dian VARCHAR(200),
    description_dian TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
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
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Insertar unidades posibles
INSERT INTO apis (name) VALUES ('No aplica'), ('AGUA OXIGENADA'), ('ACIDO VALPROICO'), ('AMIODARONA'), ('ALCOHOL'), ('BETAMETILDIGOXINA'), ('DEXAMETASONA'), ('NALOXONA'), ('KETAMINA'), ('FENITOINA'), ('FLUMAZENIL');

-- Crear proveedores
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    zip VARCHAR(200) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    dni VARCHAR(100),
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
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
    fk_id_presentation INTEGER REFERENCES presentation(id) ON DELETE SET NULL, 
    barcode VARCHAR(50) UNIQUE,
    fk_id_api INTEGER REFERENCES apis(id) ON DELETE SET NULL DEFAULT 1, -- Principio activo 
    fk_id_labs INTEGER REFERENCES labs(id) ON DELETE SET NULL,
    dosage VARCHAR(250) DEFAULT 'No aplica', --- La concentracion del producto
    fk_id_category INTEGER REFERENCES categories(id) ON DELETE RESTRICT, -- El tipo de producto(Medicamento o Insumo)
    temperature VARCHAR(250),
    sanitary_registration VARCHAR(50),
    caliber VARCHAR(50) DEFAULT 'No aplica', -- El calibre
    fk_id_unit INTEGER REFERENCES units(id) ON DELETE SET NULL,
    batch VARCHAR(50), --- El lote
    expiration_date DATE,
    shelf_life VARCHAR(50),
    iva NUMERIC(3, 2) DEFAULT 0, -- IVA in percentage (de 0 a 1)
    risk VARCHAR(50),
    ium_code1 VARCHAR(50),
    ium_code2 VARCHAR(50),
    ium_code3 VARCHAR(50),
    notes TEXT, --- Estas son observaciones
    cums_code VARCHAR(50),
    fk_id_supplier INTEGER REFERENCES suppliers(id) ON DELETE RESTRICT, -- Este es el proveedor
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE product_pricing (
    id SERIAL PRIMARY KEY,
    fk_id_product INTEGER REFERENCES products(id) ON DELETE CASCADE, -- Relación con productos
    unit_price NUMERIC(20, 3) NOT NULL, -- Costo actual del producto
    previous_cost NUMERIC(20, 3), -- Costo anterior, si aplica
    last_purchase_cost NUMERIC(20, 3), -- Costo de la última compra, si aplica
    sale_price NUMERIC(20, 3) NOT NULL, -- Precio de venta actual
    previous_sale_price NUMERIC(20, 3), -- Precio de venta anterior, si aplica
    -- effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de vigencia
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Crear inventarios
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    fk_id_product INTEGER REFERENCES products(id) ON DELETE RESTRICT, 
    fk_id_warehouse INTEGER REFERENCES warehouses(id) ON DELETE RESTRICT, 
    initial_quantity INTEGER NOT NULL,
    actual_quantity INTEGER NOT NULL,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Crear tipos de movimiento(inventarios) tipo de documentos
CREATE TABLE movement_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    status SMALLINT DEFAULT 1, -- Estado del usuario (1: Activo, 0: Inactivo o Eliminado)
    description TEXT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Insertar posibles tipos de movimiento en inventario
INSERT INTO movement_types (name) VALUES ('Entrada'), ('Salida'), ('Transferencia');

-- Crear tabla Documentos
CREATE TABLE documents (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(200) NOT NULL UNIQUE,
    fk_id_movement_types INTEGER REFERENCES warehouses(id) ON DELETE RESTRICT,
    prefix CHAR(1) NOT NULL, 
    status SMALLINT DEFAULT 1, -- Estado del documento (A=Activo, I=Inactivo)
    description TEXT NULL -- Descripción del documento
);

-- Crear tabla Movimientos
CREATE TABLE company_movements (
    id SERIAL PRIMARY KEY, -- Identificador del movimiento
    fk_id_warehouse INTEGER REFERENCES warehouses(id) ON DELETE RESTRICT, -- Código de bodega
    fk_id_document INTEGER REFERENCES documents(id) ON DELETE RESTRICT, -- Prefijo del movimiento
    number INTEGER NOT NULL, -- Número del movimiento
    reason TEXT,
    observation VARCHAR(255), -- Observaciones sobre el movimiento
    fk_id_status INTEGER REFERENCES statuses(id) ON DELETE RESTRICT DEFAULT 1,
    status SMALLINT DEFAULT 1, -- Estado del documento (A=Activo, I=Inactivo)
    total_cost NUMERIC(17, 4), -- Total costo del movimiento
    total_sale NUMERIC(17, 4), -- Total venta del movimiento
    rtf NUMERIC(9, 4) NOT NULL, -- Porcentaje de RTF
    ica NUMERIC(9, 4) NOT NULL, -- Porcentaje de ICA
    iva NUMERIC(9, 4) NOT NULL, -- Porcentaje de reteiva
    discount NUMERIC(17, 4) NOT NULL, -- Descuento aplicado
    created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1, -- Usuario que registra el movimiento
    updated_by INTEGER REFERENCES users(id) ON DELETE RESTRICT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de registro del movimiento
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Crear tabla Movimientos Detalle
CREATE TABLE company_movements_detail (
    id SERIAL PRIMARY KEY, -- Identificador del detalle
    fk_id_company_movements INTEGER NOT NULL REFERENCES company_movements(id) ON DELETE CASCADE, -- Referencia al movimiento
    fk_id_warehouse INTEGER REFERENCES warehouses(id) ON DELETE RESTRICT, -- Código de bodega
    fk_id_product INTEGER REFERENCES products(id) ON DELETE RESTRICT,  -- Código del producto
    quantity NUMERIC(17, 4) NOT NULL, -- Cantidad del producto
    iva NUMERIC(9, 2) NOT NULL, -- IVA aplicado
    unit_cost_product NUMERIC(17, 4) NOT NULL, -- Costo unitario del producto
    total_cost_product NUMERIC(17, 4) NOT NULL, -- Total costo del producto en este movimiento
    inventary INTEGER NOT NULL, -- Existencia en inventario después del movimiento
    unit_sale_value NUMERIC(17, 4) NOT NULL, -- Valor unitario de venta
    total_sale NUMERIC(17, 4) NOT NULL,  -- Total de venta del producto en este movimiento
    discount NUMERIC(17, 2), -- Descuento aplicado al producto(verificar si se aplica por producto o movimiento)
    value_freight NUMERIC(19, 3) -- Valor del flete unitario
);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Actualiza la columna updated_at a la hora actual
    RETURN NEW;  -- Retorna el nuevo registro
END;
$$ LANGUAGE plpgsql;

-- Crear el disparador para la tabla roles
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla permisos
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla permisos de roles
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON roles_permissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla sedes
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON seats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla estados
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON statuses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla bodegas
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON warehouses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla categorias
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla laboratorios
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON labs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla presentacion(producto)
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON presentation
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla unidades(producto)
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON units
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla principio activo(producto)
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON apis
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla productos
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla precios de productos
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON product_pricing
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla proveedores
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla usuarios
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla tipo de sede
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON seat_type
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla AREA
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON section
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla tipo de movimientos
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON movement_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla movimientos
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON company_movements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla detalles del movimiento
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON company_movements_detail
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear el disparador para la tabla inventarios
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON stocks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

---OJO NO METERLA HASTA REVISAR Tambien en TEXT la division de productos
---- Agregar indices, aun no estan aplicados estos son ejemplos
-- Ejemplo de índices en la tabla users
CREATE INDEX idx_users_dni ON users (dni);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_fk_id_section ON users (fk_id_section);
CREATE INDEX idx_users_fk_id_role ON users (fk_id_role);

-- Ejemplo de índices en la tabla roles_permissions
CREATE INDEX idx_roles_permissions_fk_id_roles ON roles_permissions (fk_id_roles);
CREATE INDEX idx_roles_permissions_fk_id_permissions ON roles_permissions (fk_id_permissions);

-- Ejemplo de índices en la tabla seats
CREATE INDEX idx_seats_fk_id_charge_of ON seats (fk_id_charge_of);
CREATE INDEX idx_seats_fk_id_seat_type ON seats (fk_id_seat_type);

-- Ejemplo de índices en la tabla warehouses
CREATE INDEX idx_warehouses_fk_id_seats ON warehouses (fk_id_seats);
CREATE INDEX idx_warehouses_fk_id_charge_of ON warehouses (fk_id_charge_of);

---Índices compuestos
CREATE INDEX idx_users_dni_email ON users (dni, email);

---- Uso de UNIQUE INDEX: Para columnas que deben tener valores únicos
CREATE UNIQUE INDEX idx_users_dni_unique ON users (dni);
CREATE UNIQUE INDEX idx_users_email_unique ON users (email);
-----