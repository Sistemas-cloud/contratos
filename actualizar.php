<?php	
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
} 
include 'sql/conection.php'; // Conexión a la BD

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    /* echo "<pre>";
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
    $testigo1 = $_POST['testigo1'];
    $testigo2 = $_POST['testigo2'];

    $fechaContrato_d = $_POST['fechaContrato_d'];
    $fechaTermino_d = $_POST['fechaTermino_d'];
    $sueldoMensual = $_POST['sueldoMensual'];
    $diasSeleccionados = isset($_POST['dias_d']) ? implode(", ", $_POST['dias_d']) : "";
    $horaEntrada_d = $_POST['horaEntrada_d'];
    $horaSalida_d = $_POST['horaSalida_d'];
    $actualizacion = date('Y-m-d');


    $stmt = $conexion->prepare("UPDATE contrato_determinado 
    SET nombre = ?, puesto = ?, nacionalidad = ?, edad = ?, e_civil = ?, 
        rfc = ?, domicilio = ?, curp = ?, fecha_contrato = ?, fecha_termino = ?, 
        sueldo_mensual = ?, dias = ?, hora_entrada = ?, hora_salida = ?, 
        fecha_registro = ?,  bene1 = ?, paren1 = ?, porc1 = ?, 
        bene2 = ?, paren2 = ?, porc2 = ?, nombre_act = ?, funciones = ?, ultima_act = ? , testigo1 = ?, testigo2 = ?
    WHERE id = ?");  

$stmt->bind_param("sssissssssdssssssississsssi",  
     $nombre, $puesto, $nacionalidad, $edad, $e_civil, 
     $rfc, $domicilio, $curp, $fechaContrato_d, $fechaTermino_d, 
     $sueldoMensual, $diasSeleccionados, $horaEntrada_d, $horaSalida_d, 
     $fecha_registro,  $beneficiario1, $parentesco1, $porcentaje1, 
     $beneficiario2, $parentesco2, $porcentaje2, 
     $nombre_act, $funciones, $actualizacion, $testigo1, $testigo2, $id  
 );



    // Ejecutar la consulta
    if ($stmt->execute()) {
        //echo "Registro actualizado correctamente.";
        $_GET['id'] = $id;
        include 'generar_contrato.php'; // Conexión a la BD
    } else {
        echo "Error en la inserción: " . $stmt->error;
    }

    
}