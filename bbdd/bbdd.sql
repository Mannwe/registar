CREATE DATABASE registar
	DEFAULT CHARACTER SET utf8;

USE registar;

CREATE TABLE proyectos (
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
	usuario_proyecto VARCHAR(25) NOT NULL,
	nombre VARCHAR(25) NOT NULL UNIQUE,
	descripcion TEXT,
	fecha_proyecto DATETIME NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE tareas (
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
	id_proyecto INT NOT NULL,
	descripcion TEXT,
	situacion VARCHAR(20),
	PRIMARY KEY(id),
	FOREIGN KEY(id_proyecto)
		REFERENCES proyectos(id)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

CREATE TABLE subtareas (
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
	id_tarea INT NOT NULL,
	descripcion TEXT,
	situacion VARCHAR(20),
	PRIMARY KEY(id),
	FOREIGN KEY(id_tarea)
		REFERENCES tareas(id)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);