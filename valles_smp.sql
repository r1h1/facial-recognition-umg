CREATE DATABASE valles_smp_residencial;

USE valles_smp_residencial;

-- CREACION DE TABLA ROL
CREATE TABLE rol (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL
);

-- CREACION DE TABLA MÓDULOS
CREATE TABLE modules (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    route VARCHAR(500) NOT NULL,
    idrol INT,
    FOREIGN KEY (idrol) REFERENCES rol(id)
);

-- CREACION DE TABLA USUARIOS RESIDENTES
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


-- CREACION DE TABLA VISITANTES
CREATE TABLE visitors (
    id INT PRIMARY KEY NOT NULL auto_increment,
    accesscode VARCHAR(50),
    fullname VARCHAR(100),
    addresstovisit VARCHAR(250),
    cui VARCHAR(50),
    gender INT,
    typeofvisit VARCHAR(50),
    housenumber VARCHAR(50),
    personalidentificationphoto TEXT,
    visitorphoto TEXT,
    createddate VARCHAR(50),
    expireddate VARCHAR(50),
    usergeneratedinvitation INT,
    authorization INT,
    FOREIGN KEY (usergeneratedinvitation) REFERENCES users(id)
);


-- CREACION DE TABLA INGRESOS Y SALIDAS
CREATE TABLE entrys_and_exits (
    id INT PRIMARY KEY NOT NULL auto_increment,
    iduser INT,
    dateandhourentry VARCHAR(50),
    dateandhourexit VARCHAR(50),
    typeuser INT
    FOREIGN KEY (iduser) REFERENCES users(id)
);


-- INGRESOS DE MODULOS
INSERT INTO
    `modules` (`id`, `name`, `route`, `idrol`)
VALUES
    (
        1,
        'Dashboard',
        '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>',
        1
    ),
    (
        2,
        'Mantenimiento Personas',
        '<li><a href=\"residents\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-people-fill\"></i></span><span>Mantenimiento Personas</span></a></li>',
        1
    ),
    (
        3,
        'Crear Visitantes',
        '<li><a href=\"visitors\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-person-bounding-box\"></i></span><span>Crear Visitantes</span></a></li>',
        1
    ),
    (
        4,
        'Ingreso de Visitas',
        '<li><a href=\"auth_visitors\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-shield-shaded\"></i></span><span>Ingreso de Visitas</span></a></li>',
        1
    ),
    (
        5,
        'Reportes',
        '<li><a href=\"reports\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-file-earmark-bar-graph-fill\"></i></span><span>Reportes</span></a></li>',
        1
    ),
    (
        6,
        'Dashboard',
        '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>',
        2
    ),
    (
        7,
        'Mantenimiento Personas',
        '<li><a href=\"residents\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-people-fill\"></i></span><span>Mantenimiento Personas</span></a></li>',
        2
    ),
    (
        8,
        'Crear Visitantes',
        '<li><a href=\"visitors\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-person-bounding-box\"></i></span><span>Crear Visitantes</span></a></li>',
        2
    ),
    (
        9,
        'Ingreso de Visitas',
        '<li><a href=\"auth_visitors\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-shield-shaded\"></i></span><span>Ingreso de Visitas</span></a></li>',
        2
    ),
    (
        10,
        'Reportes',
        '<li><a href=\"reports\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-file-earmark-bar-graph-fill\"></i></span><span>Reportes</span></a></li>',
        2
    ),
    (
        11,
        'Dashboard',
        '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>',
        3
    ),
    (
        12,
        'Crear Visitantes',
        '<li><a href=\"visitors\" class=\"nav-link px-3\"><span class=\"me-2\"><i class=\"bi bi-person-bounding-box\"></i></span><span>Crear Visitantes</span></a></li>',
        3
    ),
    (
        13,
        'Dashboard',
        '<li><a href=\"dashboard\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-speedometer\"></i></span> <span>Dashboard</span></a></li>',
        4
    ),
    (
        14,
        'Ingreso de Visitas',
        '<li><a href=\"auth_visitors\" class=\"nav-link px-3\"> <span class=\"me-2\"><i class=\"bi bi-shield-shaded\"></i></span><span>Ingreso de Visitas</span></a></li>',
        4
    );


-- AUTENTICACIÓN DE USUARIO
INSERT INTO
    `auth` (`id`, `user`, `password`)
VALUES
    (
        1,
        'de.rivasherrera@gmail.com',
        '$2b$05$AVZ/FplLC.7KKtR.s9D52uDd.nDpjPpjTMuGmVhQQsHTiTU7ztnOK'
    );


-- USUARIO REGISTRADO
INSERT INTO `users` (`id`, `fullname`, `address`, `phonenumber`, `email`, `cui`, `housenumber`, `idrol`, `status`, `gender`, `photo`) VALUES
(1, 'Visitante', '', '', '', '', '', 4, 0, 1, '');
INSERT INTO `users` (`id`, `fullname`, `address`, `phonenumber`, `email`, `cui`, `housenumber`, `idrol`, `status`, `gender`, `photo`) VALUES
(2, 'Daniel Rivas', 'Petapa', '45024363', 'de.rivasherrera@gmail.com', '3050000040117', '7 1-52', 1, 1, 1, '');



-- ROLES
INSERT INTO `rol` (`id`, `name`) VALUES
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Residente'),
(4, 'Seguridad');