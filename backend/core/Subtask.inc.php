<?php

/******************************************************************************/
/* Clase modelo de las subtareas											  */		
/******************************************************************************/

class Subtask implements JsonSerializable{

	private $taskId;
	private $id;
	private $description;
	private $status;

	public function __construct($taskId, $id, $description, $status){
		$this->taskId = $taskId;
		$this->id = $id;
		$this->description = $description;
		$this->status = $status;
	}

	public function getTaskId(){
		return $this->taskId;
	}

	public function getId(){
		return $this->id;
	}

	public function getDescription(){
		return $this->description;
	}

	public function getStatus(){
		return $this->status;
	}

	public function setTaskId($taskId){
		$this->taskId = $taskId;
	}

	public function setId($id){
		$this->id = $id;
	}

	public function setDescription($description){
		$this->description = $description;
	}

	public function setStatus($status){
		$this->status = $status;
	}

	public function jsonSerialize(){
        return 
        [   
            'taskId' => $this->getTaskId(),
            'id' => $this->getId(),
            'description'  => $this->getDescription(),
            'status' => $this->getStatus(),
        ];
    }
}