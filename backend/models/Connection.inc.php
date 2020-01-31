<?php

/*************************************************************************/
/* Clase de conexión a la base de datos 								 */
/*************************************************************************/
class Connection{

	private $connection;
	
	function connect(){

		require_once '../../config/global.inc.php';

		$this->connection = mysqli_connect(HOST_NAME, USERNAME, PASSWORD, DATABASE);
	}

	function disconnect($connection){
		if(!$this->connection){
			// Devolvemos error de conexión o que aún no ha sido abierta
		}else{
			$ok = mysqli_close($this->connection);
		}
	}

	function getConnection(){
		return $this->connection;
	}
}