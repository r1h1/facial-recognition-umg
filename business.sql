CREATE DATABASE valles_smp_residencial;

USE valles_smp_residencial;

-- CREACION DE TABLA ROL
CREATE TABLE rol (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL
);

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (1, 'Super Administrador');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (2, 'Administrador');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (3, 'Residente');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (4, 'Seguridad');

-- CREACION DE TABLA MÓDULOS
CREATE TABLE modules (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    route VARCHAR(500) NOT NULL,
    idrol INT,
    FOREIGN KEY (idrol) REFERENCES rol(id)
);

-- MODULOS PARA ROL SUPER ADMINISTRADOR
INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        1,
        'Dashboard',
        '<li class="activo shadow mt-2"><a href="../dashboard/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-gauge me-3"></i> Dashboard</a></li>',
        1
    );

-- CREACION DE TABLA USUARIO
CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL auto_increment,
    fullname VARCHAR(250),
    address VARCHAR(250),
    phonenumber VARCHAR(20),
    email VARCHAR(100),
    cui VARCHAR(50),
    housenumber VARCHAR(50),
    idrol INT,
    status INT,
    gender INT,
    photo LONGBLOB,
    FOREIGN KEY (idrol) REFERENCES rol(id)
);

-- CREACION DE TABLA AUTENTICACION
CREATE TABLE auth (
    id INT PRIMARY KEY NOT NULL,
    user varchar(100),
    password varchar(250)
);

-- CREACION DE TABLA PRODUCTOS
CREATE TABLE entrys_and_exits (
    id INT PRIMARY KEY NOT NULL auto_increment,
    iduser INT,
    dateandhourentry VARCHAR(50),
    dateandhourexit VARCHAR(50),
    FOREIGN KEY (iduser) REFERENCES users(id)
);

-- CREACION DE TABLA EXTRA INGREDIENTES POR PRODUCTO
CREATE TABLE visitors (
    id INT PRIMARY KEY NOT NULL auto_increment,
    accesscode VARCHAR(50),
    fullname VARCHAR(100),
    addresstovisit VARCHAR(250),
    cui VARCHAR(50),
    gender INT,
    tipeofvisit VARCHAR(50),
    housenumber VARCHAR(50),
    personalidentificationphoto TEXT,
    visitorphoto TEXT,
    createddate VARCHAR(50),
    expireddate VARCHAR(50),
    usergeneratedinvitation INT,
    FOREIGN KEY (usergeneratedinvitation) REFERENCES users(id)
);