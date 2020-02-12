<?php

/*************************************************************************/
/* Modelo de datos para la clase Task   								 */
/*************************************************************************/
class TaskModel {

	private $connection;

	public function __construct($connection){
		$this->connection = $connection;
	}

	/****************************** CONSULTAS *****************************/

	function getAllTasksByProject($taskProjectId){
		$tasks = null;
		if(isset($this->connection)){
			$query = "SELECT * FROM tareas WHERE id_proyecto = $taskProjectId ORDER BY id DESC";
			$exec = mysqli_query($this->connection, $query);

			if($exec){
				include_once '../core/Task.inc.php';
				$tasks = [];
				while($result = mysqli_fetch_array($exec)){
					$task = new Task($result['id_proyecto'],
									 $result['id'],
									 $result['descripcion'],
									 $result['situacion']);
					$tasks[] = $task;
				}
			}
		}
		return $tasks;
	}

	function findTaskById($id){

		$task = null;
		if(isset($this->connection)){
			$query = "SELECT * FROM tareas WHERE id = $id";
			$exec = mysqli_query($this->connection, $query);
			if($exec){
				while($result = mysqli_fetch_array($exec)){ 
					$task = [new Task($result['id_proyecto'],
								      $result['id'],
								      $result['descripcion'],
  									  $result['situacion'])];
				}
			}
		}
		return $task;
	}

	function findTaskByColumn($taskProjectId, $column, $value){

		$task = null;
		if(isset($this->connection)){
			include_once '../core/Task.inc.php';

			$query = "SELECT * FROM tareas WHERE id_proyecto = $taskProjectId AND $column = '$value'";
			$exec = mysqli_query($this->connection, $query);
			if($exec){
				while($result = mysqli_fetch_array($exec)){ // Sólo habrá uno por la unicidad del nombre
					$task = [new Task($result['id_proyecto'],
									  $result['id'],
									  $result['descripcion'],
									  $result['situacion'])];
				}
			}
		}
		return $task;
	}

	/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

	function createTask($task){
		$result = null;
		if(isset($this->connection)){
			$projectId = $task->getProjectId();
			$description = $task->getDescription();
			$status = $task->getStatus();
			$query = "INSERT INTO tareas (id_proyecto, descripcion, situacion) " .
					 "VALUES($projectId, '$description', '$status')";
			$result = mysqli_query($this->connection, $query);
		}
		return $result;
	}

	function updateTask($task){
		
		$result = null;
		if(isset($this->connection)){
			$id = $task->getId();
			$description = $task->getDescription();
			$status = $task->getStatus();
			$query = "UPDATE tareas SET descripcion = '$description', situacion = '$status' WHERE id = $id";
			$result = mysqli_query($this->connection, $query);			
		}
		return $result;
	}

	function deleteTask($id){

		$result = null;
		if(isset($this->connection)){
			$query = "DELETE FROM tareas WHERE id = $id";
			$result = mysqli_query($this->connection, $query);
		}
		return $result;
	}
}