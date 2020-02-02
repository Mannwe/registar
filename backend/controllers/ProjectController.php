<?php

/******************************************************************************/
/* Script que recibe las peticiones ajax del cliente y las envía a la API de  */
/* proyectos																  */		
/******************************************************************************/

include_once '../models/ProjectModel.inc.php';	
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

		if(isset($_GET['userGetAll'])){
			$projectModel = new ProjectModel($connection);
			$query = $projectModel->getAllProjects($_GET['userGetAll']);
			
			$connectionObject->disconnect($connection);

			if(!is_null($query)){
				$query['message'] = 'ok';
				echo json_encode($query);
			}else{
				echo '{"message": ""}';
			}			
		}

		if(isset($_GET['idFind'])){
			include_once '../core/Project.inc.php';

			$projectModel = new ProjectModel($connection);
			$project = $projectModel->findProjectById($_GET['idFind']);
			$connectionObject->disconnect($connection);

			if(!is_null($project)){
				$project['message'] = 'existe_registro';
				echo json_encode($project);
			}else{
				echo '{"message": "nuevo_registro"}';
			}
		}

		if(isset($_GET['userFindByColumn']) && isset($_GET['column']) && isset($_GET['value'])){
			include_once '../core/Project.inc.php';

			$projectModel = new ProjectModel($connection);
			$project = $projectModel->findProjectByColumn($_GET['userFindByColumn'], 
													      $_GET['column'], 
													      $_GET['value']);
			$connectionObject->disconnect($connection);
			if(!is_null($project)){
				$project['message'] = 'existe_registro';
				echo json_encode($project);
			}else{
				echo '{"message": "nuevo_registro"}';
			}
		}

		if(isset($_GET['idTasks'])){
			$projectModel = new ProjectModel($connection);
			$rows = $projectModel->projectHasTasks($_GET['idTasks']);

			if($rows > 0){
				echo '{"message": true}';
			}else{
				echo '{"message": false}';
			}
		}

		/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

		if(isset($_POST['userCreate']) && isset($_POST['nameCreate']) && isset($_POST['descriptionCreate'])){
			include_once '../core/Project.inc.php';
			$project = new Project($_POST['userCreate'],
								   0,
								   $_POST['nameCreate'],
								   $_POST['descriptionCreate']);

			$projectModel = new ProjectModel($connection);
			$rows = $projectModel->createProject($project);
			$connectionObject->disconnect($connection);

			if($rows > 0){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}

		if(isset($_POST['userUpdate']) && isset($_POST['idUpdate']) && isset($_POST['nameUpdate']) && isset($_POST['descUpdate'])){
			include_once '../core/Project.inc.php';
			$project = new Project($_POST['userUpdate'],
								   $_POST['idUpdate'],
								   $_POST['nameUpdate'],
								   $_POST['descUpdate']);
			$projectModel = new ProjectModel($connection);
			$ok = $projectModel->updateProject($project);
			$connectionObject->disconnect($connection);

			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}

		if(isset($_POST['idDelete'])){
			$projectModel = new ProjectModel($connection);
			$ok = $projectModel->deleteProject($_POST['idDelete']);
			$connectionObject->disconnect($connection);

			if($ok){
				echo '{"message": "ok"}';
			}else{
				echo '{"message": "error"}';
			}
		}
	}
}
