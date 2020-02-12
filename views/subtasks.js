/**********************************************************************************/
/* Script para manejar la vista de subtareas de un proyecto seleccionado          */
/**********************************************************************************/

'use strict'

function buildHTMLSubtaskRecord(subtaskRecords){
	let queryTbody = document.getElementById('querySubtasks');

    queryTbody.innerHTML = '';
    subtaskRecords.forEach((record, index) => {
        if(index < subtaskRecords.length - 1){ // Suprimimos último elemento, que es el mensaje
            let queryRow = document.createElement('tr');

            let queryCell = document.createElement('td');
            queryCell.id = 'desc-' + record.id;
            let textCell = document.createTextNode(record.description);

            if(record.status == 'C'){
                queryCell.classList.add('text-success', '_subtaskDesc');
            }else{
                queryCell.classList.add('text-dark', '_subtaskDesc');
            }

            queryCell.appendChild(textCell);
            queryRow.appendChild(queryCell);

            // Añadimos la celda con los botones de editar y borrar
            let button;
            queryCell = document.createElement('td');
            if(record.status == 'P'){    
                queryCell.classList.add('pr-0');
                button = document.createElement('button');
                button.id = 'subtaskdel-' + record.id;
                button.setAttribute('data-toggle', 'modal');
                button.setAttribute('data-target', '#messageConfirm');
                button.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'deleteSubtasks', 'float-right', 'ml-2', 'mr-1');
                button.innerHTML = '<i class="fas fa-trash-alt"></i> Borrar';
                queryCell.appendChild(button);

                button = document.createElement('button');
                button.id = 'subtasked-' + record.id;
                button.classList.add('btn', 'btn-outline-info', 'btn-sm', 'editSubtasks', 'float-right', 'ml-2');
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
                button.id = 'subtaskok-' + record.id;
                button.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'btn-block', 'completedSubtasks', 'float-right');
                button.innerHTML = '<i class="fas fa-lock-open"></i> Reabrir';
                container.appendChild(button);
                queryCell.appendChild(container);
            }else{
                button.id = 'subtaskpend-' + record.id;
                button.classList.add('btn', 'btn-outline-success', 'btn-sm', 'btn-block', 'pendingSubtasks', 'float-right');
                button.innerHTML = '<i class="fas fa-check"></i> Completar';
                container.appendChild(button);
                queryCell.appendChild(container);
            }
            queryRow.appendChild(queryCell);

            queryTbody.appendChild(queryRow);
        }
    });

    // Cargamos los eventos de los botones completar, borrar y editar
    document.querySelectorAll('.completedSubtasks').forEach(element =>{
        const id = element.id.substring(10);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('subtaskId').value = id;
            completeReopenSubtask('P');
        });
    });

    document.querySelectorAll('.pendingSubtasks').forEach(element =>{
        const id = element.id.substring(12);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('subtaskId').value = id;
            completeReopenSubtask('C');
        });
    });

    document.querySelectorAll('.deleteSubtasks').forEach(element =>{
        const id = element.id.substring(11);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('subtaskId').value = id;
        });
    });

    // Añadimos el evento click de confirmar el borrado
    let confirm = document.getElementById('confirmDelSubtask');
    confirm.addEventListener('click', deleteSubtaskRecord);

    document.querySelectorAll('.editSubtasks').forEach(element =>{
        const id = element.id.substring(10);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById("updateSubtask").style.display = "inline-block";
            document.getElementById("newSubtask").style.display = "none";
            editSubtaskRecord(id);
        });
    });
}

function getSubtasksByTask(){
	const taskId = document.getElementById('globalTaskId').value;
    getAllSubtasksByTaskRequest(taskId)
    .then(response =>{
        const subtaskArray = Object.values(response);  
        // Transformamos el objeto JSON en objeto JS y lo mosatramos en el DOM
        buildHTMLSubtaskRecord(subtaskArray);  
    })
    .catch(message =>{
        document.getElementById('subtaskMsg').innerHTML = '';
    });
}

function createSubtaskRecord(){
    // Trabajaremos con un objeto js para la tarea
    const subtask = {
        taskId: document.getElementById('globalTaskId').value,
        id: 0,
        description: document.getElementById('subtaskDescription').value,
        status: 'P'
    }
    // Primero miramos si existe el registro
    findSubtaskRecordByColumn(subtask.taskId, 'descripcion', subtask.description)
    .then(record => {
        if(record.message == 'nuevo_registro'){
            createSubtaskRecordRequest(subtask)
            .then(message =>{
                const DOMMessage = `
                    <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
                clearSubtaskScreen();
            })
            .catch(message =>{
                const DOMMessage = `
                    <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
                clearSubtaskScreen();
            })
            .then(() => {
                getSubtasksByTask(subtask.taskId);
            });
            
        }else{ 
            const DOMMessage = `
                <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                    Ya existe una tarea con esta descripción.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
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
        document.getElementById('subtaskMsg').innerHTML = DOMMessage;
    });    
}

function updateSubtaskRecord(){
    // Trabajaremos con un objeto js para la tarea
    const subtask = {
        taskId: document.getElementById('globalTaskId').value,
        id: document.getElementById('subtaskId').value,
        description: document.getElementById('subtaskDescription').value,
        status: 'P'
    }
    updateSubtaskRecordRequest(subtask)
    .then(message =>{
        const DOMMessage = `
            <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
        clearSubtaskScreen();
    })
    .catch(message =>{
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
        clearSubtaskScreen();
    })
    .then(() => {
        getSubtasksByTask(subtask.taskId);
    });
}

function deleteSubtaskRecord(){
    const id = document.getElementById('subtaskId').value;
    const taskId = document.getElementById('globalTaskId').value;
    // Trabajaremos con un objeto js para la tarea
    const subtask = {
        id
    }
    deleteSubtaskRecordRequest(id)
    .then(message =>{
        const DOMMessage = `
            <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
        clearSubtaskScreen();
        getSubtasksByTask(taskId);
    })
    .catch(message =>{
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('subtaskMsg').innerHTML = DOMMessage;    
        clearSubtaskScreen();
    });
}

function completeReopenSubtask(status){
    const id = document.getElementById('subtaskId').value;
    const projectId = document.getElementById('globalTaskId').value;

    // Buscamos la tarea para que devuelva la descripción
    findSubtaskRecord(id)
    .then(subtask =>{
        subtask.status = status;
        updateSubtaskRecordRequest(subtask)
        .then(message => {
            getSubtasksByTask(document.getElementById('globalTaskId').value);
            clearSubtaskScreen();
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

function editSubtaskRecord(id){
    findSubtaskRecord(id)
    .then(subtask =>{
        // Mostramos el resultado por pantalla
        document.getElementById('subtaskDescription').value = subtask.description;
        document.getElementById('subtaskId').value = id;
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

function initializeSubtask(){
	document.getElementById('updateSubtask').style.display = 'none';
	getSubtasksByTask();
	document.getElementById('newSubtask').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()){
            createSubtaskRecord();
        }
        form.classList.add('was-validated');
        return false;
    }, false);

    document.getElementById('updateSubtask').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()){
            updateSubtaskRecord();
        }
        form.classList.add('was-validated');
        return false;
    }, false);

    document.getElementById('cancelSubtask').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('updateSubtask').style.display = 'none';
        document.getElementById('newSubtask').style.display = 'inline-block';
        document.getElementById('subtaskMsg').innerHTML = '';
        return false;
    });

    showConfirmationSubtaskDelete();
}

function clearSubtaskScreen(){
    document.getElementById("updateSubtask").style.display = "none";
    document.getElementById("newSubtask").style.display = "inline-block";
}

function showConfirmationSubtaskDelete(){
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
                        <button id='confirmDelSubtask' class="btn btn-outline-success" data-dismiss="modal"><i class="fas fa-check"></i> Aceptar</button>
                        <button class="btn btn-outline-secondary" data-dismiss="modal">
                            <i class="far fa-window-close"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
         </div>`;
    document.getElementById('deleteSubtaskConfirmation').innerHTML = html;    
}

function loadSubtasksView(){
    let applicationView = document.getElementById('appView');
    let htmlView =
        `<div class='container'>
             <h3 class="text-info mt-5">
                 ${document.getElementById("globalTaskDesc").value}
             </h3>
             <div class="card border border-0 mt-3">
                 <div class="card-header _headerColor border border-2 text-light">
                     <h4 class='d-inline'>Introduce los datos de la subtarea</h4>
                 </div>
                 <form novalidate>
                     <div class='card-body border border-secondary'>
                         <div class="form-group">
                            <label for="subtaskDescription">Descripción:</label>
                            <input type="text" 
                                   class="form-control" 
                                   id="subtaskDescription" 
                                   placeholder='Introduce un nombre descriptivo para la subtarea'
                                   required>
                         </div>
                         <div class="invalid-feedback">
                           <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                              La descripción de la subtarea es obligatoria.
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                       	 </div>
                       	 <input type='hidden' id='subtaskId'>
                         <div id='subtaskMsg' class='my-3'></div>
                         <button id="newSubtask" class="btn btn-outline-success"><i class="fas fa-plus-circle"></i> Nueva</button>
                         <button id="updateSubtask" class="btn btn-outline-info"><i class="fas fa-edit"></i> Editar</button>
                         <button id='cancelSubtask' class="btn btn-outline-secondary float-right"><i class="fas fa-window-close"></i> Cancelar</button>
                      </div>
                      <div id='deleteSubtaskConfirmation'></div>            
                  </form>
               </div>
        </div>` +
        `<div class="container mt-4">
          <table class='table table-light table-hover table-striped'>
                <thead class='_headerColor text-light'>
                  <th scope='col'>Subtarea</th>
                  <th scope='col'></th>
                  <th scope='col'></th>
                </thead>
                <tbody id='querySubtasks'>
            </table>
        </div>`;

    applicationView.innerHTML = htmlView;

    // Inicializamos el script listando registros y preparando eventos
    initializeSubtask();    
}