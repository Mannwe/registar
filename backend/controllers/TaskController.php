<?php

/******************************************************************************/
/* Script que recibe las peticiones ajax del cliente y las envía a la API de  */
/* tareas  																      */		
/******************************************************************************/

include_once '../models/TaskModel.inc.php';	
include_once '../models/Connection.inc.php';

$connectionObject = new Connection();
$connectionObject->connect();

if(!isset($connectionObject)){
	echo '{message: "error_conexion"}';
}else{
	$connection = $connectionObject->getConnection();
	if(!isset($connection)){
		echo '{message: "error_conexion"}';
	}else{
		
		/****************************** CONSULTAS *****************************/

		if(isset($_GET['projectIdFind'])){
			$taskModel = new TaskModel($connection);
			$query = $taskModel->getAllTasksByProject($_GET['projectIdFind']);
			
			$connectionObject->disconnect($connection);

			if($query && !is_null($query)){
				$query['message'] = 'ok';
				echo json_encode($query);
			}else{
				echo '{"message": "error"}';
			}			
		}

		if(isset($_GET['idFind'])){
			include_once '../core/Task.inc.php';

			$taskModel = new TaskModel($connection);
			$task = $taskModel->findTaskById($_GET['idFind']);
			$connectionObject->disconnect($connection);

			if(!is_null($task)){
				$task['message'] = 'existe_registro';
				echo json_encode($task);
			}else{
				echo '{"message": "nuevo_registro"}';
			}
		}

		if(isset($_GET['projectIdFindByColumn']) && isset($_GET['column']) && isset($_GET['value'])){
			include_once '../core/Task.inc.php';

			$taskModel = new TaskModel($connection);
			$task = $taskModel->findTaskByColumn($_GET['projectIdFindByColumn'], 
										 	     $_GET['column'], 
												 $_GET['value']);
			$connectionObject->disconnect($connection);
			if(!is_null($task)){
				$task['message'] = 'existe_registro';
				echo json_encode($task);
			}else{
				echo '{"message": "nuevo_registro"}';
			}
		}

		/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

		if(isset($_POST['projectIdCreate']) && isset($_POST['descriptionCreate']) && isset($_POST['status'])){
			include_once '../core/Task.inc.php';
			$task = new Task($_POST['projectIdCreate'],
						     0,
						     $_POST['descriptionCreate'],
						 	 $_POST['status']);

			$taskModel = new TaskModel($connection);
			$ok = $taskModel->createTask($task);
			$connectionObject->disconnect($connection);

			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}

		if(isset($_POST['projectIdUpdate']) && isset($_POST['idUpdate']) && isset($_POST['descUpdate']) && isset($_POST['statusUpdate'])){
			include_once '../core/Task.inc.php';
			$task = new Task($_POST['projectIdUpdate'],
							 $_POST['idUpdate'],
							 $_POST['descUpdate'],
 							 $_POST['statusUpdate']);
			$taskModel = new taskModel($connection);
			$ok = $taskModel->updateTask($task);
			$connectionObject->disconnect($connection);

			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}

		if(isset($_POST['idDelete'])){
			$taskModel = new taskModel($connection);
			$ok = $taskModel->deleteTask($_POST['idDelete']);
			$connectionObject->disconnect($connection);
			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}
	}
}