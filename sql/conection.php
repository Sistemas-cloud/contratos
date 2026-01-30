<?php
$host = 'localhost';
		$basededatos = 'winston_general';
		$usuario = 'winston_richard';
		$contraseña = '101605';

			$conexion = new mysqli($host, $usuario, $contraseña, $basededatos);

			if ($conexion -> connect_errno)
				{
			die("Fallo la conexion:(".$conexion -> mysqli_connect_errno(). ")".$conexion-> mysqli_connect_error());
	 }
		mysql_connect("localhost","winston_richard","101605");
  		mysql_select_db("winston_general");
?>
