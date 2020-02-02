/**********************************************************************************/
/* Script para manejar la redirección a través de un router basado en el evento   */
/* hacchange																	  */
/**********************************************************************************/

'use strict'

$(window).bind('hashchange', () =>{

    document.getElementById('appView').innerHTML = '';

    // Detectamos la vista pulsada en el botón a través de la propiedad location
    const uri = !location.hash ? 'home' : location.hash.replace('#', '');
    switch(uri){
        case 'home':
            /*document.getElementById('globalTaskId').value = 0;
            document.getElementById('globalTaskDesc').value = '';
            document.getElementById('globalProjectId').value = 0;
            document.getElementById('globalProjectName').value = '';*/
        	loadMainView();
        break;
        case 'projects':
            /*document.getElementById('globalTaskId').value = 0;
            document.getElementById('globalTaskDesc').value = '';
            document.getElementById('globalProjectId').value = 0;
            document.getElementById('globalProjectName').value = '';*/
        	loadProjectsView();
        break;
        case 'tasks':
            /*document.getElementById('globalTaskId').value = 0;
            document.getElementById('globalTaskDesc').value = '';*/
        	loadTasksView();
        break;
        case 'subtasks':
            /*document.getElementById('globalProjectId').value = 0;
            document.getElementById('globalProjectName').value = '';*/
            loadSubtasksView();
        break;
    }

}).trigger('hashchange');