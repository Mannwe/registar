/***************************************************************************************/
/* Script controlador para hacer las peticiones Ajax al modelo en backend/controllers  */
/***************************************************************************************/

'use strict'

const urlTaskController = 'backend/controllers/TaskController.php';

/****************************** CONSULTAS *****************************/

function getAllTasksByProjectRequest(projectIdFind){
    return new Promise((resolve, reject) =>{
        const params = {
            projectIdFind
        }     
        $.ajax({
            url: urlTaskController,
            type: 'GET',
            data: params,
            success: response => {
                const taskObjects = JSON.parse(response); 
                if(taskObjects.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if (taskObjects.message == 'ok'){ 
                        resolve(taskObjects);
                    }else{
                        reject('Error al obtener la lista de tareas.');
                    }
                }
            },
            error: message => {
                console.log('Error:', message);
                reject('Error desconocido en la obtención de registros.');
            }   
        });
    });
}

function findTaskRecord(idFind){
    return new Promise((resolve, reject) =>{
        const params = {
            idFind
        }
        $.ajax({
            url: urlTaskController,
            type: 'GET',
            data: params,
            success: response => {
                const taskObject = JSON.parse(response); 
                if(taskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(taskObject.message == 'nuevo_registro'){
                        reject('La tarea no existe. No se puede editar.')
                    }else{
                        resolve(taskObject[0]); // Descartamos el elemento 1, correspondiente al mensaje
                    }
                }
            },
            error: message => {
                console.log('Error', message);
                reject('Error desconocido en la obtención del registro.');
            }    
        });   
    });
}

function findTaskRecordByColumn(projectIdFindByColumn, column, value){
	return new Promise((resolve, reject) =>{
        const params = {
            projectIdFindByColumn,
            column,
            value
        }
        $.ajax({
            url: urlTaskController,
            type: 'GET',
            data: params,
            success: response => {
                const taskObject = JSON.parse(response); 
                if(taskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    resolve(taskObject); 
                }
            },
            error: message => {
                console.log('Error', message);
                reject('Error desconocido en la obtención del registro.');
            }    
        });   
    });
}

/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

function createTaskRecordRequest(task){
    return new Promise((resolve, reject) =>{
        const params = {
            projectIdCreate: task.projectId,
            descriptionCreate: task.description,
            status: task.status
        }
        $.ajax({
            url: urlTaskController,
            type: 'POST',
            data: params,
            success: response => {
                const taskObject = JSON.parse(response); 
                if(taskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(taskObject.message == 'ok'){
                        resolve('Tarea creada con éxito.'); 
                    }else{
                        reject('Error al crear la tarea.');
                    }
                }
            },
            error: message => {
                console.log(message);
                reject('Error desconocido en la creación del registro.');
            }  
        });
    });
}

function updateTaskRecordRequest(task){
    return new Promise((resolve, reject) =>{
        const params = {
            projectIdUpdate: task.projectId,
            idUpdate: task.id,            
            descUpdate: task.description,
            statusUpdate: task.status
        }
        $.ajax({
            url: urlTaskController,
            type: 'POST',
            data: params,
            success: response => {
                const taskObject = JSON.parse(response); 
                if(taskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(taskObject.message == 'ok'){
                        resolve('Tarea modificada con éxito.'); 
                    }else{
                        reject('Error al modificar la tarea.');
                    }
                }
            },
            error: message => {
                console.log(message);
                reject('Error desconocido en la modificación del registro.');
            }
        });
    });
}

function deleteTaskRecordRequest(id){
    return new Promise((resolve, reject) =>{
        const params = {
            idDelete: id
        }
        $.ajax({
            url: urlTaskController,
            type: 'POST',
            data: params,
            success: response => {
                console.log(response);
                const taskObject = JSON.parse(response); 
                if(taskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(taskObject.message == 'ok'){
                        resolve('Tarea borrada con éxito.'); 
                    }else{
                        reject('Error al borrar la tarea.');
                    }
                }
            },
            error: message => {
                console.log(message);
                reject('Error desconocido en el borrado del registro.');
            }
        });
    });
}
