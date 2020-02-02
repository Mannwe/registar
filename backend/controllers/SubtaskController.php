<?php

/******************************************************************************/
/* Script que recibe las peticiones ajax del cliente y las envía a la API de  */
/* subtareas  																  */		
/******************************************************************************/

include_once '../models/SubtaskModel.inc.php';	
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

		if(isset($_GET['taskIdFind'])){
			$subtaskModel = new SubtaskModel($connection);
			$query = $subtaskModel->getAllSubtasksByTask($_GET['taskIdFind']);
			
			$connectionObject->disconnect($connection);

			if(!is_null($query)){
				$query['message'] = 'ok';
				echo json_encode($query);
			}else{
				echo '{"message": "error"}';
			}			
		}

		if(isset($_GET['idFind'])){
			include_once '../core/Subtask.inc.php';

			$subtaskModel = new SubtaskModel($connection);
			$subtask = $subtaskModel->findSubtaskById($_GET['idFind']);
			$connectionObject->disconnect($connection);

			if(!is_null($subtask)){
				$subtask['message'] = 'existe_registro';
				echo json_encode($subtask);
			}else{
				echo '{"message": "nuevo_registro"}';
			}
		}

		if(isset($_GET['taskIdFindByColumn']) && isset($_GET['column']) && isset($_GET['value'])){
			include_once '../core/Subtask.inc.php';

			$subtaskModel = new SubtaskModel($connection);
			$subtask = $subtaskModel->findSubtaskByColumn($_GET['taskIdFindByColumn'], 
													 	  $_GET['column'], 
														  $_GET['value']);
			$connectionObject->disconnect($connection);
			if(!is_null($subtask)){
				$task['message'] = 'existe_registro';
				echo json_encode($subtask);
			}else{
				echo '{"message": "nuevo_registro"}';
			}
		}

		/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

		if(isset($_POST['taskIdCreate']) && isset($_POST['descriptionCreate']) && isset($_POST['status'])){
			include_once '../core/Subtask.inc.php';
			$subtask = new Subtask($_POST['taskIdCreate'],
								   0,
								   $_POST['descriptionCreate'],
								   $_POST['status']);

			$subtaskModel = new SubtaskModel($connection);
			$ok = $subtaskModel->createSubtask($subtask);
			$connectionObject->disconnect($connection);

			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}

		if(isset($_POST['taskIdUpdate']) && isset($_POST['idUpdate']) && isset($_POST['descUpdate']) && isset($_POST['statusUpdate'])){
			include_once '../core/Subtask.inc.php';
			$subtask = new Subtask($_POST['taskIdUpdate'],
								   $_POST['idUpdate'],
								   $_POST['descUpdate'],
		 						   $_POST['statusUpdate']);
			$subtaskModel = new SubtaskModel($connection);
			$ok = $subtaskModel->updateSubtask($subtask);
			$connectionObject->disconnect($connection);

			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}

		if(isset($_POST['idDelete'])){
			$subtaskModel = new SubtaskModel($connection);
			$ok = $subtaskModel->deleteSubtask($_POST['idDelete']);
			$connectionObject->disconnect($connection);
			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}
	}
}