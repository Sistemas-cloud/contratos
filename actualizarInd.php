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
    // Validar que todos los campos requeridos existen
    $campos_requeridos = [
        'id', 'nombre', 'puesto', 'nacionalidad', 'edad', 'e_civil', 'rfc', 'domicilio', 'curp', 'funciones',
        'nombre_act', 'beneficiario1', 'parentesco1', 'porcentaje1', 'nivel', 'fechaInicio_ind', 'fechaContrato_ind', 'salarioTotal', 'horaEntrada_ind', 'horaSalida_ind'
    ];
    $faltantes = [];
    foreach ($campos_requeridos as $campo) {
        if (!isset($_POST[$campo]) || $_POST[$campo] === "") {
            $faltantes[] = $campo;
        }
    }
    if (count($faltantes) > 0) {
        echo "<b>Error:</b> Faltan los siguientes campos obligatorios: ";
        echo implode(", ", $faltantes);
        exit();
    }
    // Validar tipos
    if (!is_numeric($_POST['edad'])) {
        echo "<b>Error:</b> 'edad' debe ser un número entero.";
        exit();
    }
    if (!is_numeric($_POST['salarioTotal'])) {
        echo "<b>Error:</b> 'salarioTotal' debe ser un número.";
        exit();
    }
    if (!is_numeric($_POST['id'])) {
        echo "<b>Error:</b> 'id' debe ser un número entero.";
        exit();
    }
/*     echo "<pre>";
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
    $fechaLeido = $_POST['fecha_leido'];

    $fechaInicio_ind = $_POST['fechaInicio_ind'];
    $fechaContrato_ind = $_POST['fechaContrato_ind'];
    $salario = $_POST['salarioTotal'];
    $diasSeleccionados = isset($_POST['dias_ind']) ? implode(", ", $_POST['dias_ind']) : "";
    $horaEntrada_ind = $_POST['horaEntrada_ind'];
    $horaSalida_ind = $_POST['horaSalida_ind'];
    $actualizacion = date('Y-m-d');
    

    $stmt = $conexion->prepare("UPDATE contrato_indeterminado 
    SET nombre = ?, puesto = ?, nacionalidad = ?, edad = ?, e_civil = ?, 
        rfc = ?, domicilio = ?, curp = ?, fecha_leido = ?, fecha_inicio = ?, fecha_contrato = ?, 
        salario = ?, dias = ?, hora_entrada = ?, hora_salida = ?, 
        nivel = ?, bene1 = ?, paren1 = ?, porc1 = ?, 
        bene2 = ?, paren2 = ?, porc2 = ?, nombre_act = ?, funciones = ?, ultima_act = ?, testigo1 = ?, testigo2 = ?
    WHERE id = ?");  

    if ($stmt === false) {
        die('Error en prepare: ' . $conexion->error);
    }

    $stmt->bind_param("sssisssssssdsssisssssssssssi",  
         $nombre, $puesto, $nacionalidad, $edad, $e_civil, 
         $rfc, $domicilio, $curp, $fechaLeido, $fechaInicio_ind, $fechaContrato_ind, 
         $salario, $diasSeleccionados, $horaEntrada_ind, $horaSalida_ind, 
         $nivel, $beneficiario1, $parentesco1, $porcentaje1, 
         $beneficiario2, $parentesco2, $porcentaje2, 
         $nombre_act, $funciones, $actualizacion, $testigo1, $testigo2, $id  
     );

    // Ejecutar la consulta
    if ($stmt->execute()) {
        //echo "Registro actualizado correctamente.";
        $_GET['id'] = $id;
        include 'generar_contratoInd.php'; // Conexión a la BD
    } else {
        echo "Error en la inserción: " . $stmt->error;
        echo "<pre>";
print_r($_POST);
echo "</pre>";
    }

    
}