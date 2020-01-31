<?php

/*************************************************************************/
/* Modelo de datos para la clase Project 								 */
/*************************************************************************/
class ProjectModel {

	private $connection;

	public function __construct($connection){
		$this->connection = $connection;
	}

	/****************************** CONSULTAS *****************************/

	function getAllProjects($user){

		$projects = null;
		if(isset($this->connection)){
			$query = "SELECT * FROM proyectos WHERE usuario_proyecto = '$user'";
			$exec = mysqli_query($this->connection, $query);

			if($exec){
				include_once '../core/Project.inc.php';
				$projects = [];
				while($result = mysqli_fetch_array($exec)){
					$project = new Project($result['usuario_proyecto'],
										   $result['id'],
										   $result['nombre'],
										   $result['descripcion']);
					$projects[] = $project;
				}
			}
		}
		return $projects;
	}

	function findProjectById($id){

		$project = null;
		if(isset($this->connection)){
			$query = "SELECT * FROM proyectos WHERE id = $id";
			$exec = mysqli_query($this->connection, $query);
			if($exec){
				while($result = mysqli_fetch_array($exec)){ 
					$project = [new Project($result['usuario_proyecto'],
										   $result['id'],
										   $result['nombre'],
										   $result['descripcion'])];
				}
			}
		}
		return $project;
	}

	function findProjectByColumn($user, $column, $value){

		$project = null;
		if(isset($this->connection)){
			include_once '../core/Project.inc.php';

			$query = "SELECT * FROM proyectos WHERE usuario_proyecto = '$user' AND $column = '$value'";
			$exec = mysqli_query($this->connection, $query);

			if($exec){
				while($result = mysqli_fetch_array($exec)){ // Sólo habrá uno por la unicidad del nombre
					$project = [new Project($result['usuario_proyecto'],
										    $result['id'],
										    $result['nombre'],
										    $result['descripcion'])];
				}
			}
		}
		return $project;
	}

	function projectHasTasks($id){
		$result = 0;
		if(isset($this->connection)){
			$query = "SELECT COUNT(*) FROM tareas WHERE id_proyecto = $id";
			$exec = mysqli_query($this->connection, $query);
			$rs = mysqli_fetch_array($exec);
			$result = $rs[0];
		}
		return $result;
	}

	/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

	function createProject($project){
		$result = null;
		if(isset($this->connection)){
			$user = $project->getUser();
			$name = $project->getName();
			$description = $project->getDescription();
			$query = "INSERT INTO proyectos (usuario_proyecto, nombre, descripcion, fecha_proyecto) " .
					 "VALUES('$user', '$name', '$description', NOW())";
			$result = mysqli_query($this->connection, $query);
		}
		return $result;
	}

	function updateProject($project){
		
		$result = null;
		if(isset($this->connection)){
			$id = $project->getId();
			$name = $project->getName();
			$description = $project->getDescription();
			$query = "UPDATE proyectos SET descripcion = '$description' WHERE id = $id";
			$result = mysqli_query($this->connection, $query);			
		}
		return $result;
	}

	function deleteProject($id){

		$result = null;
		if(isset($this->connection)){
			$query = "DELETE FROM proyectos WHERE id = $id";
			$result = mysqli_query($this->connection, $query);
		}
		return $result;
	}
}

