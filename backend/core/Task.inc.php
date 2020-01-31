<?php

/******************************************************************************/
/* Clase modelo de las tareas												  */		
/******************************************************************************/

class Task implements JsonSerializable{

	private $projectId;
	private $id;
	private $description;
	private $status;

	public function __construct($projectId, $id, $description, $status){
		$this->projectId = $projectId;
		$this->id = $id;
		$this->description = $description;
		$this->status = $status;
	}

	public function getProjectId(){
		return $this->projectId;
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

	public function setProjectId($projectId){
		$this->projectId = $projectId;
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
            'projectId' => $this->getProjectId(),
            'id' => $this->getId(),
            'description'  => $this->getDescription(),
            'status' => $this->getStatus(),
        ];
    }
}