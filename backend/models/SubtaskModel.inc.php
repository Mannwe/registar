<?php

/*************************************************************************/
/* Modelo de datos para la clase Subtask  								 */
/*************************************************************************/
class SubtaskModel {

	private $connection;

	public function __construct($connection){
		$this->connection = $connection;
	}

	/****************************** CONSULTAS *****************************/

	function getAllSubtasksByTask($taskId){
		$subtasks = null;
		if(isset($this->connection)){
			$query = "SELECT * FROM subtareas WHERE id_tarea = $taskId";
			$exec = mysqli_query($this->connection, $query);

			if($exec){
				include_once '../core/Subtask.inc.php';
				$subtasks = [];
				while($result = mysqli_fetch_array($exec)){
					$subtask = new Subtask($result['id_tarea'],
										   $result['id'],
										   $result['descripcion'],
										   $result['situacion']);
					$subtasks[] = $subtask;
				}			
			}
		}
		return $subtasks;
	}

	function findSubtaskById($id){

		$subtasks = null;
		if(isset($this->connection)){
			$query = "SELECT * FROM subtareas WHERE id = $id";
			$exec = mysqli_query($this->connection, $query);
			if($exec){
				while($result = mysqli_fetch_array($exec)){ 
					$subtasks = [new Subtask($result['id_tarea'],
										     $result['id'],
										     $result['descripcion'],
		  									 $result['situacion'])];
				}
			}
		}
		return $subtasks;
	}

	function findSubtaskByColumn($taskId, $column, $value){

		$subtask = null;
		if(isset($this->connection)){
			include_once '../core/Task.inc.php';

			$query = "SELECT * FROM subtareas WHERE id_tarea = $taskId AND $column = '$value'";
			$exec = mysqli_query($this->connection, $query);
			if($exec){
				while($result = mysqli_fetch_array($exec)){ // Sólo habrá uno por la unicidad del nombre
					$subtask = [new Task($result['id_tarea'],
										 $result['id'],
										 $result['descripcion'],
										 $result['situacion'])];
				}
			}
		}
		return $subtask;
	}

	/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

	function createSubtask($subtask){
		$result = null;
		if(isset($this->connection)){
			$taskId = $subtask->getTaskId();
			$description = $subtask->getDescription();
			$status = $subtask->getStatus();
			$query = "INSERT INTO subtareas (id_tarea, descripcion, situacion) " .
					 "VALUES($taskId, '$description', '$status')";
			$result = mysqli_query($this->connection, $query);
		}
		return $result;
	}

	function updateSubtask($subtask){
		
		$result = null;
		if(isset($this->connection)){
			$id = $subtask->getId();
			$description = $subtask->getDescription();
			$status = $subtask->getStatus();
			$query = "UPDATE subtareas SET descripcion = '$description', situacion = '$status' WHERE id = $id";
			$result = mysqli_query($this->connection, $query);			
		}		
		return $result;
	}

	function deleteSubtask($id){

		$result = null;
		if(isset($this->connection)){
			$query = "DELETE FROM subtareas WHERE id = $id";
			$result = mysqli_query($this->connection, $query);
		}
		return $result;
	}
}