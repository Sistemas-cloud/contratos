<?php	

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
} 
include 'sql/conection.php'; // Conexión a la BD

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['valorContrato'])) {
        die("Error: No se recibió el tipo de contrato.");
    }
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    $tipo = $_POST['valorContrato'];
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


    $fecha_registro = date('Y-m-d');
    //$nivel = 1; // Variable para bind_param()

    if ($tipo == "determinado") {
        // Validar y sanitizar los datos de entrada
        $fechaContrato_d = filter_var($_POST['fechaContrato_d'], FILTER_SANITIZE_STRING);
        $fechaTermino_d = filter_var($_POST['fechaTermino_d'], FILTER_SANITIZE_STRING); 
        $sueldoMensual = filter_var($_POST['sueldoMensual'], FILTER_VALIDATE_FLOAT);
        $diasSeleccionados = isset($_POST['dias_d']) ? implode(",", array_map('filter_var', $_POST['dias_d'], array_fill(0, count($_POST['dias_d']), FILTER_SANITIZE_STRING))) : "";
        $horaEntrada_d = filter_var($_POST['horaEntrada_d'], FILTER_SANITIZE_STRING);
        $horaSalida_d = filter_var($_POST['horaSalida_d'], FILTER_SANITIZE_STRING);

        // Preparar la consulta con los campos alineados
        $sql = "INSERT INTO contrato_determinado (
            nombre, puesto, nacionalidad, edad, e_civil, rfc, domicilio, curp,
            fecha_contrato, fecha_termino, sueldo_mensual, dias,
            hora_entrada, hora_salida, fecha_registro, nivel,
            bene1, paren1, porc1, bene2, paren2, porc2,
            nombre_act, funciones, testigo1, testigo2
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?
        )";

        $stmt = $conexion->prepare($sql);
        if (!$stmt) {
            die("Error en la preparación de la consulta: " . $conexion->error);
        }

        $stmt->bind_param("sssissssssdssssissississss",
            $nombre, $puesto, $nacionalidad, $edad, $e_civil, $rfc, $domicilio, $curp,
            $fechaContrato_d, $fechaTermino_d, $sueldoMensual, $diasSeleccionados,
            $horaEntrada_d, $horaSalida_d, $fecha_registro, $nivel,
            $beneficiario1, $parentesco1, $porcentaje1,
            $beneficiario2, $parentesco2, $porcentaje2,
            $nombre_act, $funciones, $testigo1, $testigo2
        );




    } elseif ($tipo == "indeterminado") {
        // Validar y sanitizar los datos de entrada
        $fechaLeido = filter_var($_POST['fecha_leido'], FILTER_SANITIZE_STRING);
        $fechaInicio_ind = filter_var($_POST['fechaInicio_ind'], FILTER_SANITIZE_STRING);
        $fechaContrato_ind = filter_var($_POST['fechaContrato_ind'], FILTER_SANITIZE_STRING);
        $salarioTotal = filter_var($_POST['salarioTotal'], FILTER_VALIDATE_FLOAT);
        $diasSeleccionados = isset($_POST['dias_ind']) ? implode(",", array_map('filter_var', $_POST['dias_ind'], array_fill(0, count($_POST['dias_ind']), FILTER_SANITIZE_STRING))) : "";
        $horaEntrada_ind = filter_var($_POST['horaEntrada_ind'], FILTER_SANITIZE_STRING);
        $horaSalida_ind = filter_var($_POST['horaSalida_ind'], FILTER_SANITIZE_STRING);

        // Preparar la consulta con los campos alineados
        $sql = "INSERT INTO contrato_indeterminado (
            nombre, puesto, nacionalidad, edad, e_civil, rfc, domicilio, curp, fecha_leido,
            fecha_inicio, fecha_contrato, salario, dias,
            hora_entrada, hora_salida, fecha_registro, nivel,
            bene1, paren1, porc1, bene2, paren2, porc2,
            nombre_act, funciones, testigo1, testigo2
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?
        )";

        $stmt = $conexion->prepare($sql);
        if (!$stmt) {
            die("Error en la preparación de la consulta: " . $conexion->error);
        }

        $stmt->bind_param("sssisssssssdssssissississss",
            $nombre, $puesto, $nacionalidad, $edad, $e_civil, $rfc, $domicilio, $curp, $fechaLeido,
            $fechaInicio_ind, $fechaContrato_ind, $salarioTotal, $diasSeleccionados,
            $horaEntrada_ind, $horaSalida_ind, $fecha_registro, $nivel,
            $beneficiario1, $parentesco1, $porcentaje1,
            $beneficiario2, $parentesco2, $porcentaje2,
            $nombre_act, $funciones, $testigo1, $testigo2
        );



    } elseif ($tipo == "porHora") {
        // Validar y sanitizar los datos de entrada
        $fechaInicioEsc = filter_var($_POST['fechaInicioEsc'], FILTER_SANITIZE_STRING);
        $fechaTerminoEsc = filter_var($_POST['fechaTerminoEsc'], FILTER_SANITIZE_STRING); 
        $fechaContrato_hora = filter_var($_POST['fechaContrato_hora'], FILTER_SANITIZE_STRING);
        $diasSeleccionados = isset($_POST['dias_hora']) ? implode(",", array_map('filter_var', $_POST['dias_hora'], array_fill(0, count($_POST['dias_hora']), FILTER_SANITIZE_STRING))) : "";
        $horaEntrada_hora = filter_var($_POST['horaEntrada_hora'], FILTER_SANITIZE_STRING);
        $horaSalida_hora = filter_var($_POST['horaSalida_hora'], FILTER_SANITIZE_STRING);
        $costoHora = filter_var($_POST['costoHora'], FILTER_VALIDATE_FLOAT);

        // Preparar la consulta con los campos alineados
        $sql = "INSERT INTO contrato_hora (
            nombre, puesto, nacionalidad, edad, e_civil, rfc, domicilio, curp,
            fecha_inicio_esc, fecha_termino_esc, fecha_contrato,
            dias, hora_entrada, hora_salida, costo_hora,
            fecha_registro, nivel, bene1, paren1, porc1,
            bene2, paren2, porc2, nombre_act, funciones, testigo1, testigo2
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?
        )";

        $stmt = $conexion->prepare($sql);
        if (!$stmt) {
            die("Error en la preparación de la consulta: " . $conexion->error);
        }

        $stmt->bind_param("sssissssssssssdsissississss",
            $nombre, $puesto, $nacionalidad, $edad, $e_civil, $rfc, $domicilio, $curp,
            $fechaInicioEsc, $fechaTerminoEsc, $fechaContrato_hora,
            $diasSeleccionados, $horaEntrada_hora, $horaSalida_hora, $costoHora,
            $fecha_registro, $nivel, $beneficiario1, $parentesco1, $porcentaje1,
            $beneficiario2, $parentesco2, $porcentaje2,
            $nombre_act, $funciones, $testigo1, $testigo2
);


    } elseif($tipo=="proyecto") {

    } else{
            die("Error: Tipo de contrato no válido.");

    }

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo "Registro insertado correctamente.";
    } else {
        echo "Error en la inserción: " . $stmt->error;
    }

    $stmt->close();
    $conexion->close();
    exit();
}
?>