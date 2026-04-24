CREATE DATABASE IF NOT EXISTS nexus_board_db;
USE nexus_board_db;

CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    is_active  TINYINT   DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_status (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS boards (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    owner_id    INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    reporter_id INT NOT NULL,
    assigned_id INT,
    board_id    INT NOT NULL,
    status_id   INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (assigned_id) REFERENCES users(id),
    FOREIGN KEY (board_id)    REFERENCES boards(id),
    FOREIGN KEY (status_id)   REFERENCES task_status(id)
);

-- Datos iniciales para task_status
INSERT INTO task_status (name) VALUES ('Pending'), ('In Progress'), ('Done');

-- ============================================================
-- DATOS DE PRUEBA
-- Passwords en texto plano:
--   admin@nexus.com     => Admin1234!
--   nicolas@nexus.com   => Nicolas1234!
--   carlos@nexus.com    => Carlos1234!
-- ============================================================

INSERT INTO users (name, email, password) VALUES
    ('Admin',   'admin@nexus.com',   '$2b$10$GbEbA3oWHAOfCwFYxcAZQuVwgIyW2XFeaWuHoDkHYnAwsL5xgBtGu'),
    ('Nicolas', 'nicolas@nexus.com', '$2b$10$AvkUeCDCllrlOrc471rgZOC3GxXRAWa7SjUXlUKecaYKpDQZYjTm2'),
    ('Carlos',  'carlos@nexus.com',  '$2b$10$CPYwdriAGF6U44uP2xjtfe3FqwZzxocrK6m3ttgU9HCK4eszs33.O');

INSERT INTO boards (name, description, owner_id) VALUES
    ('Nexus General',    'Board principal del proyecto Nexus', 1),
    ('Frontend',         'Tareas de UI y componentes',         2),
    ('Backend',          'API, base de datos y servicios',     2),
    ('DevOps',           'CI/CD, infra y despliegues',         1);

INSERT INTO tasks (title, description, reporter_id, assigned_id, board_id, status_id) VALUES
    ('Configurar proyecto base',    'Inicializar repo y estructura de carpetas',        1, 2, 1, 3),
    ('Disenar esquema de BD',       'Definir tablas y relaciones en MySQL',             1, 2, 3, 3),
    ('Implementar autenticacion',   'Login y registro con JWT',                         2, 2, 3, 3),
    ('Crear endpoints de boards',   'CRUD completo para boards',                        2, 3, 3, 2),
    ('Crear endpoints de tasks',    'CRUD completo para tasks',                         2, 3, 3, 1),
    ('Diseno de pantalla principal','Maqueta de la vista kanban',                       3, 3, 2, 2),
    ('Componente tarjeta de tarea', 'Card draggable con titulo y estado',               3, 3, 2, 1),
    ('Configurar pipeline CI',      'GitHub Actions para lint y tests',                 1, 1, 4, 1),
    ('Dockerizar el backend',       'Dockerfile y docker-compose para desarrollo',      1, 1, 4, 2),
    ('Documentar la API',           'README con endpoints, params y ejemplos',          2, NULL, 1, 1);
