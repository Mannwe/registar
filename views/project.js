/**********************************************************************************/
/* Script para manejar la vista del alta y modificación de los proyectos          */
/**********************************************************************************/

'use strict'

function buildHTMLProjectRecord(projectRecords){
    let queryTbody = document.getElementById('queryProjects');

    queryTbody.innerHTML = '';
    projectRecords.forEach((record, index) => {
        if(index < projectRecords.length - 1){ // Suprimimos último elemento, que es el mensaje
            let queryRow = document.createElement('tr');

            let queryCell = document.createElement('th');
            queryCell.classList.add('_projectName', '_pointer');
            queryCell.id = 'name-' + record.id;
            let textCell = document.createTextNode(record.name);
            queryCell.appendChild(textCell);
            queryRow.appendChild(queryCell);

            queryCell = document.createElement('td');
            textCell = document.createTextNode(record.description);
            queryCell.appendChild(textCell);
            queryRow.appendChild(queryCell);

            // Añadimos la celda con los botones de editar y borrar
            queryCell = document.createElement('td');
            let button = document.createElement('button');
            button.id = 'projdel-' + record.id;
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#messageConfirm');
            button.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'deleteProjects', 'float-right', 'ml-2');
            button.innerHTML = '<i class="fas fa-trash-alt"></i> Borrar';
            queryCell.appendChild(button);

            button = document.createElement('button');
            button.id = 'projed-' + record.id;
            button.classList.add('btn', 'btn-outline-info', 'btn-sm', 'editProjects', 'float-right', 'ml-2');
            button.innerHTML = '<i class="fas fa-edit"></i> Editar';
            queryCell.appendChild(button);
            queryRow.appendChild(queryCell);

            queryTbody.appendChild(queryRow);
        }
    });

    // Cargamos los eventos de los botones borrar y editar
    document.querySelectorAll('.deleteProjects').forEach(element =>{
        const id = element.id.substring(8);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('projectId').value = id;
        });
    });

    // Añadimos el evento click de confirmar el borrado
    let confirm = document.getElementById('confirmDelProject');
    confirm.addEventListener('click', deleteProjectRecord);

    document.querySelectorAll('.editProjects').forEach(element =>{
        const id = element.id.substring(7);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById("updateProject").style.display = "inline-block";
            document.getElementById("newProject").style.display = "none";
            editProjectRecord(id);
        });
    });

    // Evento click en la celda del nombre para abrir tareas
    document.querySelectorAll('._projectName').forEach(element =>{
        const id = element.id.substring(5);
        document.getElementById(element.id).addEventListener('click', function(){
            document.getElementById('globalProjectId').value = id;
            document.getElementById('globalProjectName').value = element.innerHTML;
            location.href = '#tasks';
        });
    });
}

function getProjects(){
    const user = document.getElementById('userId').innerHTML;
    getAllProjectsRequest(user)
    .then(response =>{
        const projectsArray = Object.values(response);          

        // Transformamos el objeto JSON en objeto JS y lo mosatramos en el DOM
        buildHTMLProjectRecord(projectsArray);  
    })
    .catch(message =>{
        console.log(message);
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('projectMsg').innerHTML = DOMMessage;
    });
}

function createProjectRecord(){
    // Trabajaremos con un objeto js para el proyecto
    const project = {
        id: document.getElementById('projectId').value,
        user: document.getElementById('userId').innerHTML,
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value
    }
    // Primero miramos si existe el registro
    findProjectRecordByColumn(project.user, 'nombre', project.name)
    .then(record => {
        if(record.message == 'nuevo_registro'){ // El registro no existe, por lo que creamos
            createProjectRecordRequest(project)
            .then(message =>{
                const DOMMessage = `
                    <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                document.getElementById('projectMsg').innerHTML = DOMMessage;    
                getProjects();
                clearProjectScreen();
            })
            .catch(message =>{
                const DOMMessage = `
                    <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                document.getElementById('projectMsg').innerHTML = DOMMessage;    
                clearProjectScreen();
            });
        }else{ // El registro existe, por lo que actualizamos
            const DOMMessage = `
                <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                    Ya existe un proyecto con este nombre.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('projectMsg').innerHTML = DOMMessage;    
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
        document.getElementById('projectMsg').innerHTML = DOMMessage;        
    });    
}

function updateProjectRecord(){
    // Trabajaremos con un objeto js para el proyecto
    const project = {
        id: document.getElementById('projectId').value,
        user: document.getElementById('userId').innerHTML,
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value
    }
    updateProjectRecordRequest(project)
    .then(message =>{
        const DOMMessage = `
            <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('projectMsg').innerHTML = DOMMessage;    
        clearProjectScreen();
    })
    .catch(message =>{
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('projectMsg').innerHTML = DOMMessage;    
        clearProjectScreen();
    })
    .then(() => {
        getProjects();
    });
}

function editProjectRecord(id){
    findProjectRecord(id)
    .then(project =>{
        // Mostramos el resultado por pantalla
        let nameDOM = document.getElementById('projectName');
        nameDOM.value = project.name;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectId').value = id;

        // Deshabilitamos el nombre
        nameDOM.disabled = true;
    })
    .catch(message => {
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('projectMsg').innerHTML = DOMMessage;
    });
}

function validateProjectHasTasks(id){
    return new Promise((resolve, reject) =>{
        projectHasTasksRequest(id)
        .then(result =>{
            if(result.message == true){
                reject('El proyecto tiene tareas. No se puede eliminar.');
            }else{
                resolve();
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
            document.getElementById('projectMsg').innerHTML = DOMMessage;    
        });
    })
}

function deleteProjectRecord(){

    const id = document.getElementById('projectId').value;
    // Trabajaremos con un objeto js para el proyecto
    const project = {
        id
    }
    // Comprobamos que no tenga tareas
    validateProjectHasTasks(id)
    .then(() =>{
        deleteProjectRecordRequest(id)
        .then(message =>{
            const DOMMessage = `
                <div class='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                    ${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('projectMsg').innerHTML = DOMMessage;    
            getProjects();
            clearProjectScreen();
        })
        .catch(message =>{
            const DOMMessage = `
                <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                    ${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
            document.getElementById('projectMsg').innerHTML = DOMMessage;    
            clearProjectScreen();
        });
    })
    .catch(message =>{
        const DOMMessage = `
            <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                ${message}        
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        document.getElementById('projectMsg').innerHTML = DOMMessage;
    });    
}

function clearProjectScreen(){
    let idDOM = document.getElementById('projectId');
    let nameDOM = document.getElementById('projectName');
    let descriptionDOM = document.getElementById('projectDescription');

    document.getElementById('updateProject').style.display = 'none';
    document.getElementById('newProject').style.display = 'inline-block';

    /*nameDOM.value = '';
    descriptionDOM.value = '';    */
    idDOM.value = '0';

    nameDOM.disabled = false;
}

function initializeProject(){
    document.getElementById("updateProject").style.display = 'none';
    getProjects();

    // Aplicamos la validación customizada de Bootstrap
    document.getElementById('newProject').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()){
            createProjectRecord();
        }
        form.classList.add('was-validated');
        return false;
    }, false);

    document.getElementById('updateProject').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()){
            updateProjectRecord();
        }
        form.classList.add('was-validated');
        return false;
    }, false);

    document.getElementById('cancelProject').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('updateProject').style.display = 'none';
        document.getElementById('newProject').style.display = 'inline-block';
        document.getElementById('projectMsg').innerHTML = '';
        document.getElementById('projectName').disabled = false;
        return false;
    });
    showConfirmationProjectDelete();
}

function showConfirmationProjectDelete(){
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
                        ¿Está seguro de que desea borrar este proyecto?
                    </div>
                    <div class="modal-footer border-top-0">
                        <button id='confirmDelProject' class="btn btn-outline-success" data-dismiss="modal"><i class="fas fa-check"></i> Aceptar</button>
                        <button class="btn btn-outline-secondary" data-dismiss="modal">
                            <i class="far fa-window-close"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
         </div>`;
    document.getElementById('deleteProjectConfirmation').innerHTML = html;    
}

function loadProjectsView(){
    let applicationView = document.getElementById('appView');
    let htmlView =
        `<div class='container'>
             <div class="card border border-0 mt-3">
                 <div class="card-header _headerColor border border-2 text-light ">
                     <h3>Introduce los datos del proyecto</h3>
                 </div>
                 <div class='card-body border border-secondary'>
                 <form id='projectForm' novalidate>
                       <div class="form-group">
                          <label for="project">Proyecto:</label>
                          <input id='projectName' 
                                 type="text" 
                                 class="form-control" 
                                 placeholder='Introduce un nombre descriptivo para el proyecto'
                                 required>
                           <div class="invalid-feedback">
                               <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                                  El nombre del proyecto es obligatorio.
                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                           </div>       
                       </div>
                       <div class="form-group">
                          <label for="description">Descripción:</label>
                          <textarea id='projectDescription' 
                                    class="form-control" 
                                    rows="3" 
                                    placeholder='Introduce una descripción detallada del proyecto'
                                    required></textarea>
                          <div class="invalid-feedback">
                               <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                                  La descripción del proyecto es obligatoria.
                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                           </div>  
                       </div>
                       <input type='hidden' id='projectId'>
                       <div id='projectMsg' class='my-3'></div>
                       <button id='newProject' class="btn btn-outline-success"><i class="fas fa-plus-circle"></i> Nuevo</button>
                       <button id='updateProject' class="btn btn-outline-info"><i class="fas fa-edit"></i> Editar</button>
                       <button id='cancelProject' class="btn btn-outline-secondary float-right"><i class="fas fa-window-close"></i> Cancelar</button>
                      </div>                  
                      <div id='deleteProjectConfirmation'></div>
                  </div>
               </div>
           </div>
        </div>` +
        `<div class="container mt-4">
          <table class='table table-light table-hover table-striped'>
              <thead class='_headerColor text-light'>
                <th>Proyecto</th>
                <th>Descripción</th>
                <th></th>
              </thead>
              <tbody id='queryProjects'>
              </body>
          </table>
        </div>`;

    applicationView.innerHTML = htmlView;

    // Inicializamos el script listando registros y preparando eventos
    initializeProject();    
}
