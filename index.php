<!doctype html>
<html lang="es">
  	<head>
	    <!-- Required meta tags -->
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	    <!-- Fuentes -->
	    <link href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap" rel="stylesheet">

	    <!-- Bootstrap CSS -->
	    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	    <link rel="stylesheet" href="css/styles.css">

		<!-- Fontawesome --> 
	    <link rel="stylesheet" href="css/all.css">
	    
	   <title>Registar - Registro de Tareas</title>
  	</head>
  	<body>
  		<!-- La barra de navegación es común a todas las vistas -->
  		<nav class="navbar sticky-top border border-2 navbar-sm navbar-dark _headerColor p-0">
  			<div class="container my-0">
				<a class="navbar-brand" href='#home'><h3>RegisTar</h3></a>
				<ul id='navigation' class='navbar nav'>					
				</ul>
			</div>
		</nav>
		<!-- Sección donde colocaremos el código de las distintas páginas -->
  		<section id='appView' class='pt-3'></section>

  		<!-- Campos para comunicar unas pantallas con otras -->
		<input type='hidden' id='globalTaskId'>
		<input type='hidden' id='globalTaskDesc'>

	    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
	    <script src='js/jquery-3.4.1.min.js'></script>
	    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

		<!-- Acceso al código JS de los controladores -->
		<script src='js/api/project.api.js'></script>	
		<script src='js/api/task.api.js'></script>
		<script src='js/api/subtask.api.js'></script>

		<!-- Vistas JS -->
		<script src='views/project.js'></script>
		<script src='views/subtasks.js'></script>
		<script src='views/tasks.js'></script>

  		<!-- Código JS cliente--> 
	    <script src='js/main.js'></script>
	    <script src='js/router.js'></script>
	    <script src='js/initialize.js'></script>
  	</body>
</html>