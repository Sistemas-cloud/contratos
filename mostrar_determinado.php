<?php
include 'sql/conection.php'; // Conexión a la BD

// Consulta para los contratos de tiempo determinado
$nivel = $_SESSION['nivel'];
if($_SESSION['permiso']!=2){
	$query = "SELECT * FROM contrato_determinado WHERE nivel = '$nivel' AND nombre_act NOT LIKE '%Laura%'";	
}else{
	if($nivel==2){
		$query = "SELECT * FROM contrato_determinado";
	}else{
		$query = "SELECT * FROM contrato_determinado WHERE nivel = '$nivel'";
	}
}
$result = $conexion->query($query);

// Verifica si hay resultados
if ($result->num_rows > 0) {
    // Imprimir filas de la tabla
    while ($row = $result->fetch_assoc()) {
		// Ruta del contrato
		$contrato_path = "pdf/contrato" . $row['id'] . ".pdf";
		
		// Comenzamos a generar la fila de la tabla
		echo "<tr>";
		echo "<td>" . $row['nombre'] . "</td>";
		echo "<td>" . $row['puesto'] . "</td>";
		echo "<td>" . $row['nacionalidad'] . "</td>";
		echo "<td>" . $row['edad'] . "</td>";
		echo "<td>" . $row['e_civil'] . "</td>";
		echo "<td>" . $row['rfc'] . "</td>";
		echo "<td>" . $row['domicilio'] . "</td>";
		echo "<td>" . $row['curp'] . "</td>";
		echo "<td>" . $row['fecha_contrato'] . "</td>";
		echo "<td>" . $row['fecha_termino'] . "</td>";
		echo "<td>" . $row['sueldo_mensual'] . "</td>";
		echo "<td>" . $row['dias'] . "</td>";
		echo "<td>" . $row['hora_entrada'] . "</td>";
		echo "<td>" . $row['hora_salida'] . "</td>";
		echo "<td>" . $row['funciones'] . "</td>";
		echo "<td>" . $row['bene1'] . "</td>";
		echo "<td>" . $row['paren1'] . "</td>";
		echo "<td>" . $row['porc1'] . "</td>";
		echo "<td>" . $row['bene2'] . "</td>";
		echo "<td>" . $row['paren2'] . "</td>";
		echo "<td>" . $row['porc2'] . "</td>";
		echo "<td>" . $row['ultima_act'] . "</td>";
		echo "<td>" . $row['nombre_act'] . "</td>";

	
		// Aquí agregamos la lógica para verificar si el archivo del contrato existe
		echo "<td>";
		if (file_exists($contrato_path)) {
			// Si el contrato existe, mostramos el botón "Ver Contrato"
			echo "<a href='" . $contrato_path . "' class='btn btn-ver' target='_blank'>Ver Contrato</a>";
		} else {
			// Si el contrato no existe, mostramos el botón "Generar Contrato"
			echo "<a href='generar_contrato.php?id=" . $row['id'] . "' class='btn btn-generar'>Generar Contrato</a>";
		}
		
		// También agregamos el botón "Editar"
		echo "<a href='editar_contrato.php?id=" . $row['id'] . "' class='btn btn-editar'>Editar</a>";
		echo "<a href='eliminar_contrato.php?id=" . $row['id'] . "' class='btn btn-editar'>Eliminar</a>";
		echo "</td>";
	
		echo "</tr>";
	}
} else {
    echo "<tr><td colspan='9'>No se encontraron contratos de tiempo determinado.</td></tr>";
}

$conexion->close();
?>