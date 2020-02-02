/***************************************************************************************/
/* Script controlador para hacer las peticiones Ajax al modelo en backend/controllers  */
/***************************************************************************************/

const urlProjectController = 'backend/controllers/ProjectController.php';

/****************************** CONSULTAS *****************************/

function getAllProjectsRequest(userGetAll){
    return new Promise((resolve, reject) =>{
        const params = {
            userGetAll
        }            
        $.ajax({
            url: urlProjectController,
            type: 'GET',
            data: params,
            success: response => {
                const projectObjects = JSON.parse(response); 
                if(projectObjects.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if (projectObjects.message == 'ok'){ 
                        resolve(projectObjects);
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

function findProjectRecord(idFind){
    return new Promise((resolve, reject) =>{
        const params = {
            idFind
        }
        $.ajax({
            url: urlProjectController,
            type: 'GET',
            data: params,
            success: response => {
                const projectObject = JSON.parse(response); 
                if(projectObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(projectObject.message == 'nuevo_registro'){
                        reject('El proyecto no existe. No se puede editar.')
                    }else{
                        resolve(projectObject[0]); // Descartamos el elemento 1, correspondiente al mensaje
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

function findProjectRecordByColumn(userFindByColumn, column, value){
    return new Promise((resolve, reject) =>{
        const params = {
            userFindByColumn,
            column,
            value
        }
        $.ajax({
            url: urlProjectController,
            type: 'GET',
            data: params,
            success: response => {
                const projectObject = JSON.parse(response); 
                if(projectObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    resolve(projectObject); 
                }
            },
            error: message => {
                console.log('Error', message);
                reject('Error desconocido en la obtención del registro.');
            }    
        });   
    });
}

function projectHasTasksRequest(idTasks){
    return new Promise((resolve, reject) =>{
        const params = {
            idTasks
        }
        $.ajax({
            url: urlProjectController,
            type: 'GET',
            data: params,
            success: response =>{
                const projectObject = JSON.parse(response);
                resolve(projectObject);
            },
            error: message =>{
                console.log(message);
                reject('Error desconocido en la obtención del registro.');
            }
        });
    });
}

/************************** ALTAS, BAJAS, MODIFICACIONES *************************/

function createProjectRecordRequest(project){
    return new Promise((resolve, reject) =>{
        const params = {
            userCreate: project.user,
            nameCreate: project.name,
            descriptionCreate: project.description
        }
        $.ajax({
            url: urlProjectController,
            type: 'POST',
            data: params,
            success: response => {
                const projectObject = JSON.parse(response); 
                if(projectObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(projectObject.message == 'ok'){
                        resolve('Proyecto creado con éxito.'); 
                    }else{
                        reject('Error al crear el proyecto.');
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

function updateProjectRecordRequest(project){
    return new Promise((resolve, reject) =>{
        const params = {
            userUpdate: project.user,
            idUpdate: project.id,
            nameUpdate: project.name,
            descUpdate: project.description
        }
        $.ajax({
            url: urlProjectController,
            type: 'POST',
            data: params,
            success: response => {
                const projectObject = JSON.parse(response); 
                if(projectObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(projectObject.message == 'ok'){
                        resolve('Proyecto modificado con éxito.'); 
                    }else{
                        reject('Error al modificar el proyecto.');
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

function deleteProjectRecordRequest(id){
    return new Promise((resolve, reject) =>{
        const params = {
            idDelete: id
        }
        $.ajax({
            url: urlProjectController,
            type: 'POST',
            data: params,
            success: response => {
                const projectObject = JSON.parse(response); 
                if(projectObject.message == 'error_conexion'){
                    reject('Error al conectar con la base de datos.');
                }else{
                    if(projectObject.message == 'ok'){
                        resolve('Proyecto borrado con éxito.'); 
                    }else{
                        reject('Error al borrar el proyecto.');
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