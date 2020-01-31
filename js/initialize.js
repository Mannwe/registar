/**********************************************************************************/
/* Script para inicializar la aplicación una vez se cargue el DOM del documento   */
/**********************************************************************************/

document.addEventListener('DOMContentLoaded', () =>{
	document.getElementById('appView').innerHTML = '';

	// Iniciamos mostrando la ventana del usuario
	loadMainView();
});