<?php
include 'sql/conection.php'; // Conexión a la BD

// Consulta para los contratos de tiempo determinado
$nivel = $_SESSION['nivel'];
if($_SESSION['permiso']!=2){
	$query = "SELECT * FROM contrato_hora WHERE nivel = '$nivel' AND nombre_act NOT LIKE '%Laura%'";	
}else{
	if($nivel==2){
		$query = "SELECT * FROM contrato_hora";
	}else{
		$query = "SELECT * FROM contrato_hora WHERE nivel = '$nivel'";
	}
}
echo $query;
$result = $conexion->query($query);

// Verifica si hay resultados
if ($result->num_rows > 0) {
    // Imprimir filas de la tabla
    while ($row = $result->fetch_assoc()) {
		// Ruta del contrato PDF
		$contrato_path = "pdf/contratohora" . $row['id'] . ".pdf";
		
		echo "<tr>
				<td>" . $row['nombre'] . "</td>
				<td>" . $row['puesto'] . "</td>
				<td>" . $row['nacionalidad'] . "</td>
				<td>" . $row['edad'] . "</td>
				<td>" . $row['e_civil'] . "</td>
				<td>" . $row['rfc'] . "</td>
				<td>" . $row['domicilio'] . "</td>
				<td>" . $row['curp'] . "</td>
				<td>" . $row['fecha_inicio_esc'] . "</td>
				<td>" . $row['fecha_termino_esc'] . "</td>
				<td>" . $row['fecha_contrato'] . "</td>
				<td>" . $row['dias'] . "</td>
				<td>" . $row['hora_entrada'] . "</td>
				<td>" . $row['hora_salida'] . "</td>
				<td>" . $row['costo_hora'] . "</td>
				<td>" . $row['funciones'] . "</td>
				<td>" . $row['bene1'] . "</td>
				<td>" . $row['paren1'] . "</td>
				<td>" . $row['porc1'] . "</td>
				<td>" . $row['bene2'] . "</td>
				<td>" . $row['paren2'] . "</td>
				<td>" . $row['porc2'] . "</td>
				<td>" . $row['ultima_act'] . "</td>
				<td>" . $row['nombre_act'] . "</td>
				<td>";
	
		// Verifica si el contrato ya existe
		if (file_exists($contrato_path)) {
			// Si existe, muestra el botón para ver el contrato
			echo "<a href='" . $contrato_path . "' class='btn btn-ver' target='_blank'>Ver Contrato</a>";
		} else {
			// Si no existe, muestra el botón para generarlo
			echo "<a href='generar_hora.php?id=" . $row['id'] . "' class='btn btn-generar'>Generar Contrato</a>";
		}
	
		// Botón de editar contrato (siempre presente)
		echo " <a href='editar_contratoHora.php?id=" . $row['id'] . "' class='btn btn-editar'>Editar</a>";
		echo "<a href='eliminar_contratoHora.php?id=" . $row['id'] . "' class='btn btn-editar'>Eliminar</a>";
	
		echo "</td></tr>";
	}
} else {
    echo "<tr><td colspan='9'>No se encontraron contratos de tiempo determinado.</td></tr>";
}

$conexion->close();
?>