 /**********************************************************************************/
/* Script para manejar la vista de tareas de un proyecto seleccionado             */
/**********************************************************************************/

'use strict'

function buildHTMLTaskRecord(taskRecords){

    let queryTbody = document.getElementById('queryTasks');

    queryTbody.innerHTML = '';
    taskRecords.forEach((record, index) => {
        if(index < taskRecords.length - 1){ // Suprimimos último elemento, que es el mensaje
            let queryRow = document.createElement('tr');

            let queryCell = document.createElement('td');
            queryCell.id = 'desc-' + record.id;
            let textCell = document.createTextNode(record.description);

            if(record.status == 'C'){
                queryCell.classList.add('text-success', '_taskDesc', '_pointer');
            }else{
                queryCell.classList.add('text-dark', '_taskDesc', '_pointer');
            }

            queryCell.appendChild(textCell);
            queryRow.appendChild(queryCell);

            // Añadimos la celda con los botones de editar y borrar
            let button;
            queryCell = document.createElement('td');
            if(record.status == 'P'){    
                queryCell.classList.add('pr-0');
                button = document.createElement('button');
                button.id = 'taskdel-' + record.id;
                button.setAttribute('data-toggle', 'modal');
                button.setAttribute('data-target', '#messageConfirm');
                button.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'deleteTasks', 'float-right', 'ml-2', 'mr-1');
                button.innerHTML = '<i class="fas fa-trash-alt"></i> Borrar';
                queryCell.appendChild(button);

                button = document.createElement('button');
                button.id = 'tasked-' + record.id;
                button.classList.add('btn', 'btn-outline-info', 'btn-sm', 'editTasks', 'float-right', 'ml-2');
                button.innerHTML = '<i class="fas fa-edit"></i> Editar';
                queryCell.appendChild(button);
            }
            queryRow.appendChild(queryCell);

            // Añadimos la celda con el botón de tarea completada 
            queryCell = document.createElement('td');
            let container = document.createElement('div');
            container.classList.add('border', 'border-top-0', 'border-bottom-0', 'border-right-0', 'border-left-2', 'border-info', 
                                    'btn-block', 'pl-3', 'float-right');
            button = document.createElement('button');

            if(record.status == 'C'){
                button.id = 'taskok-' + record.id;
                button.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'btn-block', 'completedTasks', 'float-right');
                button.innerHTML = '<i class="fas fa-lock-open"></i> Reabrir';
                container.appendChild(button);
                queryCell.appendChild(container);
            }else{
                button.id = 'taskpend-' + record.id;
                button.classList.add('btn', 'btn-outline-success', 'btn-sm', 'btn-block', 'pendingTasks', 'float-right');
                button.innerHTML = '<i class="fas fa-check"></i> Completar';
                container.appendChild(button);
                queryCell.appendChild(container);
            }
            queryRow.appendChild(queryCell);

            queryTbody.appendChild(queryRow);
        }
    });

    // Cargamos los eventos de los botones completar, borrar y editar
    document.querySelectorAll('.completedTasks').forEach(element =>{
        const id = element.id.substring(7);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('globalTaskId').value = id;
            completeReopenTask('P');
        });
    });

    document.querySelectorAll('.pendingTasks').forEach(element =>{
        const id = element.id.substring(9);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('globalTaskId').value = id;
            completeReopenTask('C');
        });
    });

    document.querySelectorAll('.deleteTasks').forEach(element =>{
        const id = element.id.substring(8);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('globalTaskId').value = id;
        });
    });

    // Añadimos el evento click de confirmar el borrado
    let confirm = document.getElementById('confirmDelTask');
    confirm.addEventListener('click', deleteTaskRecord);

    document.querySelectorAll('.editTasks').forEach(element =>{
        const id = element.id.substring(7);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById("updateTask").style.display = "inline-block";
            document.getElementById("newTask").style.display = "none";
            editTaskRecord(id);
        });
    });

    // Evento click en la celda de la descripción para abrir subtareas
    document.querySelectorAll('._taskDesc').forEach(element =>{
        const id = element.id.substring(5);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('globalTaskId').value = id;
            document.getElementById('globalTaskDesc').value = element.innerHTML;
            location.href = '#subtasks';
        });
    });
}

function getTasksByProject(projectId){
    getAllTasksByProjectRequest(projectId)
    .then(response =>{
        const taskArray = Object.values(response);  
        // Transformamos el objeto JSON en objeto JS y lo mosatramos en el DOM
        buildHTMLTaskRecord(taskArray);          
    })
    .catch(message =>{
        console.log('message', message);
        document.getElementById('taskMsg').innerHTML = '';
    });
}

function createTaskRecord(){
    // Trabajaremos con un objeto js para la tarea
    const task = {
        projectId: document.getElementById('globalProjectId').value,
        id: 0,
        description: document.getElementById('taskDescription').value,
        status: 'P'
    }
    // Primero miramos si existe el registro
    findTaskRecordByColumn(task.projectId, 'descripcion', task.description)
    .then(record => {
        if(record.message == 'nuevo_registro'){
            createTaskRecordRequest(task)
            .then(message =>{
                const DOMMessage = `
                    <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                document.getElementById('taskMsg').innerHTML = DOMMessage;    
                getTasksByProject(document.getElementById('globalProjectId').value);
                clearTaskScreen();
            })
            .catch(message =>{
                const DOMMessage = `
                    <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                document.getElementById('taskMsg').innerHTML = DOMMessage;    
                clearTaskScreen();
            });
            
        }else{ 
            const DOMMessage = `
                <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                    Ya existe una tarea con esta descripción.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('taskMsg').innerHTML = DOMMessage;    
        }
    })
    .catch(message => {
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;
    });    
}

function updateTaskRecord(){
    // Trabajaremos con un objeto js para la tarea
    const task = {
        projectId: document.getElementById('globalProjectId').value,
        id: document.getElementById('globalTaskId').value,
        description: document.getElementById('taskDescription').value,
        status: 'P'
    }
    /* Control extraño y necesario pare evitar transacciones innecesarias porque aparentemente
       se ejecuta el método simplemente con sólo declararlo en el addEventListener */
    //if(task.project != '' && task.id != '' && task.description != '' && task.status != ''){
        updateTaskRecordRequest(task)
        .then(message =>{
            const DOMMessage = `
                <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                    ${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('taskMsg').innerHTML = DOMMessage;    
            getTasksByProject(document.getElementById('globalProjectId').value);
            clearTaskScreen();
        })
        .catch(message =>{
            const DOMMessage = `
                <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                    ${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('taskMsg').innerHTML = DOMMessage;    
            clearTaskScreen();
        });
    //}
}

function deleteTaskRecord(){
    const id = document.getElementById('globalTaskId').value;
    const projectId = document.getElementById('globalProjectId').value;
    // Trabajaremos con un objeto js para la tarea
    const task = {
        id
    }
    deleteTaskRecordRequest(id)
    .then(message =>{
        const DOMMessage = `
            <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;    
        getTasksByProject(document.getElementById('globalProjectId').value);
        clearTaskScreen();
    })
    .catch(message =>{
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;    
        clearTaskScreen();
    })
    
}

/*function buildHTMLProjectsMenu(projectsRecords){

    let projectsMenu = document.getElementById('taskProject');

    // Introducimos un valor en blanco para que el desplegable aparezca vacío
    let projectOption = document.createElement("option");
    projectOption.text = '';
    projectOption.value = 0;
    projectsMenu.appendChild(projectOption);
    
    projectsRecords.forEach((record, index) => {
        if(index < projectsRecords.length - 1){ // Descartamos el último elemento porque es el mensaje
          let projectOption = document.createElement("option");
          projectOption.classList.add('_projectName');
          projectOption.text = record.name;
          projectOption.value = record.id;
          projectsMenu.appendChild(projectOption);
        }
    });
}

function getProjectsForTasks(){
    const user = document.getElementById('userId').innerHTML;
    getAllProjectsRequest(user)
    .then(response =>{
        const projectsArray = Object.values(response);          
        console.log('entro');
        // Transformamos el objeto JSON en objeto JS y lo mosatramos en el DOM
        buildHTMLProjectsMenu(projectsArray);  
    })
    .catch(message =>{
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                '${message}'
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;
    });
}*/

/*function saveTaskRecord(){

    // Trabajaremos con un objeto js para la tarea
    const task = {
        projectId: document.getElementById('taskProjectId').value,
        id: document.getElementById('globalTaskId').value,
        description: document.getElementById('taskDescription').value,
        status: 'P'
    }
    // Primero miramos si existe el registro
    findTaskRecordByColumn(task.projectId, 'descripcion', task.description)
    .then(record => {
        if(record.message == 'nuevo_registro'){ // El registro no existe, por lo que creamos
            createTaskRecord(task);
            
        }else{ // El registro existe, por lo que actualizamos
            updateTaskRecord(task); 
        }
    })
    .catch(message => {
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;
    });
}*/

function completeReopenTask(status){
    const id = document.getElementById('globalTaskId').value;
    const projectId = document.getElementById('globalProjectId').value;

    // Buscamos la tarea para que devuelva la descripción
    findTaskRecord(id)
    .then(task =>{
        task.status = status;
        updateTaskRecordRequest(task)
        .then(message => {
            getTasksByProject(document.getElementById('globalProjectId').value);
            clearTaskScreen();
        });  

    })    
    .catch(message => {
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;
    });    
}

function editTaskRecord(id){
    findTaskRecord(id)
    .then(task =>{
        // Mostramos el resultado por pantalla
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('globalTaskId').value = id;
    })
    .catch(message => {
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('taskMsg').innerHTML = DOMMessage;
    });
}

/*function projectSelection(){
    
    // Guardamos el id del proyecto seleccionado en el campo hidden
    const projectId = document.getElementById('taskProject').value;
    document.getElementById('globalProjectId').value = projectId;
    document.getElementById('globalProjectId').value = 0;
    document.getElementById('globalProjectName').value = '';

    getTasksByProject(projectId);
}*/

function clearTaskScreen(){
    let taskIdDOM = document.getElementById('globalTaskId');
    let descriptionDOM = document.getElementById('taskDescription');

    //taskDescription.value = '';    
    
    document.getElementById("updateTask").style.display = "none";
    document.getElementById("newTask").style.display = "inline-block";

    taskIdDOM.value = '0';
}

function initializeTask(){
    document.getElementById("updateTask").style.display = 'none';
    //getProjectsForTasks();

    const projectId = document.getElementById('globalProjectId');
    const projectName = document.getElementById('globalProjectName');
    let taskProject = document.getElementById('taskProject');

    getTasksByProject(projectId.value);

    if(projectId.value != 0 && projectName.value != ''){            
        taskProject.value = projectName.value;
    }
    
    //document.getElementById('taskProject').addEventListener('change', projectSelection);
    document.getElementById('newTask').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()){
            createTaskRecord();
        }
        form.classList.add('was-validated');
        return false;
    }, false);

    document.getElementById('updateTask').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()){
            updateTaskRecord();
        }
        form.classList.add('was-validated');
        return false;
    }, false);

    document.getElementById('cancelTask').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('updateTask').style.display = 'none';
        document.getElementById('newTask').style.display = 'inline-block';
        document.getElementById('taskMsg').innerHTML = '';
        return false;
    });
    showConfirmationTaskDelete();
}

function showConfirmationTaskDelete(){
    // Añadimos el mensaje de confirmación de borrado al código html
    let html = 
        `<div class="modal fade" id="messageConfirm" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header _headerColor text-light">
                    <h5 class="modal-title">Registar - <span class="h6">Mensaje de confirmación</span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span class="text-ligh" aria-hidden="true">&times;</span></button></div>
                    <div class="modal-body">
                        ¿Está seguro de que desea borrar esta tarea?
                    </div>
                    <div class="modal-footer border-top-0">
                        <button id='confirmDelTask' class="btn btn-outline-success" data-dismiss="modal"><i class="fas fa-check"></i> Aceptar</button>
                        <button class="btn btn-outline-secondary" data-dismiss="modal">
                            <i class="far fa-window-close"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
         </div>`;
    document.getElementById('deleteTaskConfirmation').innerHTML = html;    
}

function loadTasksView(){
    let applicationView = document.getElementById('appView');
    let htmlView =
        `<div class='container'>
             <div class="card border border-0 mt-3">
                 <div class="card-header _headerColor border border-2 text-light">
                     <h3 class='d-inline'>Introduce los datos de la tarea</h3>
                 </div>
                 <form novalidate>
                     <div class='card-body border border-secondary'>
                         <div class="form-group">
                             <label for="taskProject">Proyecto:</label>
                             <input type="text" 
                                 class="form-control" 
                                 id="taskProject" 
                                 disabled>
                         </div>
                         <div class="form-group">
                            <label for="taskDescription">Descripción:</label>
                            <input type="text" 
                                   class="form-control" 
                                   id="taskDescription" 
                                   placeholder='Introduce un nombre descriptivo para la tarea'
                                   required>
                         </div>
                         <div class="invalid-feedback">
                           <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                              La descripción de la tarea es obligatoria.
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                       </div>
                         <div id='taskMsg' class='my-3'></div>
                         <button id="newTask" class="btn btn-outline-success"><i class="fas fa-plus-circle"></i> Nueva</button>
                         <button id="updateTask" class="btn btn-outline-info"><i class="fas fa-edit"></i> Editar</button>
                         <button id='cancelTask' class="btn btn-outline-secondary float-right"><i class="fas fa-window-close"></i> Cancelar</button>
                      </div>
                      <div id='deleteTaskConfirmation'></div>            
                  </form>
               </div>
           </div>
        </div>`;

        // Tabla con la lista de tareas
        htmlView += `
          <div class="container mt-4">
            <table class='table table-light table-hover table-striped'>
                <thead class='_headerColor text-light'>
                  <th scope='col'>Tarea</th>
                  <th scope='col'></th>
                  <th scope='col'></th>
                </thead>
                <tbody id='queryTasks'>
            </table>
          </div>

        `;
      
    applicationView.innerHTML = htmlView;

    // Inicializamos el script listando registros y preparando eventos
    initializeTask(); 
}
