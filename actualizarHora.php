<?php	

/* error_reporting(E_ALL);
ini_set('display_errors', 1); */

session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
} 
include 'sql/conection.php'; // Conexión a la BD

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   /*  echo "<pre>";
    print_r($_POST);
    echo "</pre>"; */
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $puesto = $_POST['puesto'];
    $nacionalidad = $_POST['nacionalidad'];
    $edad = $_POST['edad'];
    $e_civil = $_POST['e_civil'];
    $rfc = $_POST['rfc'];
    $domicilio = $_POST['domicilio'];
    $curp = $_POST['curp'];
    $funciones = $_POST['funciones'];
    $nombre_act = $_POST['nombre_act'];
    $beneficiario1 = $_POST['beneficiario1'];
    $parentesco1 = $_POST['parentesco1'];
    $porcentaje1 = $_POST['porcentaje1'];
    $beneficiario2 = $_POST['beneficiario2'];
    $parentesco2 = $_POST['parentesco2'];
    $porcentaje2 = $_POST['porcentaje2'];
    $nivel = $_POST['nivel'];

    $fechaInicioEsc = $_POST['fechaInicioEsc'];
    $fechaTerminoEsc = $_POST['fechaTerminoEsc'];
    $fechaContrato_hora = $_POST['fechaContrato_hora'];
    $diasSeleccionados = isset($_POST['dias_hora']) ? implode(", ", $_POST['dias_hora']) : "";
    $horaEntrada_hora = $_POST['horaEntrada_hora'];
    $horaSalida_hora = $_POST['horaSalida_hora'];
    $costoHora = $_POST['costoHora'];
    $testigo1 = $_POST['testigo1'];
    $testigo2 = $_POST['testigo2'];

    $actualizacion = date('Y-m-d');
    $stmt = $conexion->prepare("UPDATE contrato_hora 
    SET nombre = ?, puesto = ?, nacionalidad = ?, edad = ?, e_civil = ?, 
        rfc = ?, domicilio = ?, curp = ?, fecha_inicio_esc = ?, fecha_termino_esc = ?, fecha_contrato = ?,
        costo_hora = ?, dias = ?, hora_entrada = ?, hora_salida = ?, 
        funciones = ?, bene1 = ?, paren1 = ?, porc1 = ?, 
        bene2 = ?, paren2 = ?, porc2 = ?, nombre_act = ?, ultima_act = ?, testigo1 = ?, testigo2 = ?
    WHERE id = ?");  

    $stmt->bind_param("sssisssssssdssssssississssi",  
        $nombre, $puesto, $nacionalidad, $edad, $e_civil, 
        $rfc, $domicilio, $curp, $fechaInicioEsc, $fechaTerminoEsc, $fechaContrato_hora,
        $costoHora, $diasSeleccionados, $horaEntrada_hora, $horaSalida_hora,
        $funciones, $beneficiario1, $parentesco1, $porcentaje1,
        $beneficiario2, $parentesco2, $porcentaje2,
        $nombre_act, $actualizacion, $testigo1, $testigo2, $id
    );



    // Ejecutar la consulta
    if ($stmt->execute()) {
        //echo "Registro actualizado correctamente.";
        $_GET['id'] = $id;
        include 'generar_hora.php'; // Conexión a la BD
    } else {
        echo "Error en la inserción: " . $stmt->error;
    }

    
}