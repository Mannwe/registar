<?php

/******************************************************************************/
/* Clase modelo de los proyectos											  */		
/******************************************************************************/

class Project implements JsonSerializable{

	private $user;
	private $id;
	private $name;
	private $description;

	public function __construct($user, $id, $name, $description){
		$this->user = $user;
		$this->id = $id;
		$this->name = $name;
		$this->description = $description;
	}

	public function getUser(){
		return $this->user;
	}

	public function getId(){
		return $this->id;
	}

	public function getName(){
		return $this->name;
	}

	public function getDescription(){
		return $this->description;
	}

	public function setUser($user){
		$this->user = $user;
	}

	public function setId($id){
		$this->id = $id;
	}

	public function setName($name){
		$this->name = $name;
	}

	public function setDescription($description){
		$this->description = $description;
	}

	public function jsonSerialize(){
        return 
        [   
            'user' => $this->getUser(),
            'id' => $this->getId(),
            'name' => $this->getName(),
            'description'  => $this->getDescription()
        ];
    }
}