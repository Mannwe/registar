# Welcome to RegisTar


<b>Description</b>

This is a simple application to help us to register tasks or steps, including subtask, regarding a project. It was born from my need of
registering my own tasks when developing a project. Of course I could download one of the probably hundreds of existing apps to do this,
but it also seemed to me a nice way of sharping my programming skills.

<b>How to deploy it</b>

You need to install a PHP and MySQL servers. I recommend you to use tools like wamp, xamp, etc., so that you have everything
in your own computer. 
Once you get it done, download the application zip file from this repository and extract it in the server root folder. You will access
to the tool by writing the url http://localhost/folder_name_you_decided (I suggest http://localhost/registar, as this is the name of the application).

To build the database, you will find the bbdd file, named sql/bbdd.sql. Just import it from your MySQL admin or copy/paste the code in 
its SQL Editor to create the database.

<b>Signing up and logging</b>

There is a "log in" in the application. I did not want to set a complete log in mechanism as I wanted to keep the project as simple
as possible, but as I think it´s necessary to record the project´s history under an user name or nickname, the first screen is the
way to identify yourself and fulfill further projects within your signature.

<b>How to use it</b>

The concept is very simple. Once you enter your name, the program will redirect you to the tasks screen, as it will be the more
visited. But first, you need to create a first project where you will link tasks. So:

* Go to Projects screen (Proyectos in Spanish) and add a new one (button Nuevo) by entering the name of the project (Nombre) and a 
  description (Descripción). Once you have done it, it will be shown as part of a list of projects. You will be able to edit or 
  delete it.
* Go then to the tasks screen (Tareas in Spanish) and create a new one (button Nueva). It will appear in a table below.
* You can mark a task as completed by pressing the button "Completar". If you have one of them already completed, you can undo it
  and make it active again.
* If you need it, you can create subtasks by pressing the task name in the list table. A new screen will come up where fill new
  subtasks.

The overall behaviour is very intuitive and user-friendly, just play around!

<b>Final considerations</b>

This application is only in Spanish, but I plan a translation to English in further versions. Hopefully the labels are intuitive and understandable enough (I think so!).

Although I am a professional developer, web applications are still a hobby. So, I am currently learning, any comments and improvement ideas will be welcome!

Enjoy!
