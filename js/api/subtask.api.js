/***************************************************************************************/
/* Script controlador para hacer las peticiones Ajax al modelo en backend/controllers  */
/***************************************************************************************/

'use strict'

const urlSubtaskController = 'backend/controllers/SubtaskController.php';

/****************************** CONSULTAS *****************************/

function getAllSubtasksByTaskRequest(taskIdFind){
    return new Promise((resolve, reject) =>{
        const params = {
            taskIdFind
        }     
        $.ajax({
            url: urlSubtaskController,
            type: 'GET',
            data: params,
            success: response => {
            	const subtaskObjects = JSON.parse(response); 
                if(subtaskObjects.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if (subtaskObjects.message == 'ok'){ 
                        resolve(subtaskObjects);
                    }else{
                        reject('Error al obtener la lista de subtareas.');
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

function findSubtaskRecordByColumn(taskIdFindByColumn, column, value){
	return new Promise((resolve, reject) =>{
        const params = {
            taskIdFindByColumn,
            column,
            value
        }
        $.ajax({
            url: urlSubtaskController,
            type: 'GET',
            data: params,
            success: response => {
            	const subtaskObject = JSON.parse(response); 
                if(subtaskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    resolve(subtaskObject); 
                }
            },
            error: message => {
                console.log('Error', message);
                reject('Error desconocido en la obtención del registro.');
            }    
        });   
    });
}

function findSubtaskRecord(idFind){
    return new Promise((resolve, reject) =>{
        const params = {
            idFind
        }
        $.ajax({
            url: urlSubtaskController,
            type: 'GET',
            data: params,
            success: response => {
                const subtaskObject = JSON.parse(response); 
                if(subtaskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(subtaskObject.message == 'nuevo_registro'){
                        reject('La subtarea no existe. No se puede editar.')
                    }else{
                        resolve(subtaskObject[0]); // Descartamos el elemento 1, correspondiente al mensaje
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

/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

function createSubtaskRecordRequest(subtask){
    return new Promise((resolve, reject) =>{
        const params = {
            taskIdCreate: subtask.taskId,
            descriptionCreate: subtask.description,
            status: subtask.status
        }
        $.ajax({
            url: urlSubtaskController,
            type: 'POST',
            data: params,
            success: response => {
                const subtaskObject = JSON.parse(response); 
                if(subtaskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(subtaskObject.message == 'ok'){
                        resolve('Subtarea creada con éxito.'); 
                    }else{
                        reject('Error al crear la subtarea.');
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

function updateSubtaskRecordRequest(subtask){
    return new Promise((resolve, reject) =>{
        const params = {
            taskIdUpdate: subtask.taskId,
            idUpdate: subtask.id,            
            descUpdate: subtask.description,
            statusUpdate: subtask.status
        }
        $.ajax({
            url: urlSubtaskController,
            type: 'POST',
            data: params,
            success: response => {
            	const subtaskObject = JSON.parse(response); 
                if(subtaskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(subtaskObject.message == 'ok'){
                        resolve('Subtarea modificada con éxito.'); 
                    }else{
                        reject('Error al modificar la subtarea.');
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
            url: urlSubtaskController,
            type: 'POST',
            data: params,
            success: response => {
                console.log(response);
                const subtaskObject = JSON.parse(response); 
                if(subtaskObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(subtaskObject.message == 'ok'){
                        resolve('Subtarea borrada con éxito.'); 
                    }else{
                        reject('Error al borrar la subtarea.');
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