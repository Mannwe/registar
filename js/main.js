/**********************************************************************************/
/* Script para manejar la vista main con el registro del usuario                  */
/**********************************************************************************/

'use strict'

function setUser(){

    // Actualizamos el usuario en el menú
    let navigation = document.getElementById('navigation');
    navigation.innerHTML = '';
    
    let li = document.createElement('li');
    li.classList.add('nav-item');
    let a = document.createElement('a');
    a.setAttribute('href', '#projects');
    a.classList.add('nav-link', 'text-light');
    a.innerHTML = '<h6><i class="fas fa-tasks"></i> Proyectos</h6>';
    li.appendChild(a);
    navigation.appendChild(li);

    li = document.createElement('li');
    li.classList.add('nav-item');
    a = document.createElement('a');
    a.setAttribute('href', '#tasks');
    a.classList.add('nav-link', 'text-light');
    a.innerHTML = '<h6><i class="fas fa-thumbtack"></i> Tareas</h6>';
    li.appendChild(a);
    navigation.appendChild(li);

    initializeMenu();
    let user = document.getElementById('user');
    let anchorUserId = document.getElementById('anchorUserId');
    anchorUserId.classList.add('float-right');
    anchorUserId.innerHTML = '<h6><i class="fas fa-user"></i> <span id="userId">' + user.value + '</span></h6>';

    // Vamos a la pantalla de los proyectos
    location.href = '#tasks';
}

function initializeMenu(){
    let navigation = document.getElementById('navigation');    
        
    let li = document.createElement('li');
    li.classList.add('nav-item', 'ml-5');
    let a = document.createElement('a');
    a.id = 'anchorUserId';
    a.setAttribute('href', '#home');
    a.classList.add('nav-link', 'text-light');
    a.innerHTML = '<h6><i class="fas fa-user"></i> <span id="userId">Inicio de Sesión<span></h6>';
    li.appendChild(a);
    navigation.appendChild(li);

    
    // Aplicamos la validación customzada de Bootstrap
    document.getElementById('taskSubmit').addEventListener('click', function(e){
        e.preventDefault();
        let form = e.target.form;
        if (form.checkValidity()) {
            setUser();
        }
        form.classList.add('was-validated');
        return false;
    }, false);
}

function loadMainView(){
    let applicationView = document.getElementById('appView');
    const htmlView =
        `<div class='container'>
             <div class="card border border-0 mt-3">
                 <div class="card-header _headerColor text-light border border-2">
                     <h3>Introducción del nombre de usuario</h3>
                 </div>
                 <div class='card-body border bg-light border-secondary'>
                 <form novalidate>
                   <div class="form-group">
                       <label for="user">Nombre:</label>
                       <input type="text" 
                              class="form-control" 
                              id="user" 
                              placeholder='Introduce el nombre o nickname para identificarte'
                              required>
                       <div class="invalid-feedback">
                           <div class='alert alert-danger alert-dismissible fade show mt-3' role='alert'>
                              El nombre de usuario es obligatorio para iniciar sesión
                              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                       </div>       
                   </div>
                   <button id='taskSubmit' class="btn btn-outline-success btn-lg"><i class="fas fa-sign-in-alt"></i> Entrar</button>
                 </form>
               </div>
           </div>
        </div>`;

    applicationView.innerHTML = htmlView;

    // Inicializamos el script listando registros y preparando eventos
    document.getElementById('navigation').innerHTML = '';
    initializeMenu();  
}
