<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
} 
include 'sql/conection.php'; // Conexiones a la BD
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $nivel = $_SESSION['nivel'];

    // Obtener registros
    // Consulta para los contratos de tiempo determinado
    $query = "SELECT * FROM contrato_determinado WHERE id = '$id'";
    $result = $conexion->query($query);
    
    // Verifica si hay resultados
    if ($result->num_rows > 0) {
        // Imprimir filas de la tabla
        while ($row = $result->fetch_assoc()) {
                $nombre = $row['nombre'];
				$puesto = $row['puesto'];
				$nacionalidad = $row['nacionalidad'];
				$edad = $row['edad'];
				$e_civil = $row['e_civil'];
				$rfc = $row['rfc'];
				$domicilio = $row['domicilio'];
				$curp = $row['curp'];
				$fecha_contrato = $row['fecha_contrato'];
				$fecha_termino = $row['fecha_termino'];
				$sueldo__mensual = $row['sueldo_mensual'];
				$dias = $row['dias'];
				$hora_entrada = $row['hora_entrada'];
				$hora_salida = $row['hora_salida'];
				$funciones = $row['funciones'];
				$bene1 = $row['bene1'];
				$paren1 = $row['paren1'];
				$porc1 = $row['porc1'];
				$bene2 = $row['bene2'];
				$paren2 = $row['paren2'];
				$porc2 = $row['porc2'];
				$testigo1 = $row['testigo1'];
				$testigo2 = $row['testigo2'];

        }
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contratos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/styles_main.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100vh;
            margin: 0;
            padding-top: 20px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            width: 90%;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
        }
        label {
            font-weight: bold;
        }
        .form-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            align-items: center;
        }
        .form-group label {
            display: block;
        }
        .form-group select,
        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        #tipoContrato {
            width: 100%;
        }
        .hidden { display: none; }
        .btn {
            display: inline-block;
            padding: 10px;
            background: #FF9800;
            color: white;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            transition: 0.3s;
            width: 100%;
            border: none;
            cursor: pointer;
            margin-top: 15px;
        }
        .btn:hover {
            background: #F57C00;
            transform: scale(1.05);
        }
        .error {
            color: red;
            font-size: 12px;
        }
        .logout-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: red;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .logout-btn:hover {
            background: darkred;
        }
        #funciones {
        width: 100%;  
        height: 150px; 
        font-size: 16px;
        padding: 10px;
        resize: vertical; 
        word-wrap: break-word; /* Permite que las palabras largas se ajusten */
        overflow: auto; /* Agrega scroll si es necesario */
        white-space: pre-wrap; /* Mantiene los saltos de línea */
        }
    </style>
</head>
<body>

    <div class="container">
    <button class="logout-btn" onclick="cerrarSesion()">Cerrar sesión</button>
    <h2>Bienvenido, <?php echo $_SESSION['user']; ?> 👋</h2>
        <hr>
        <h4>Editar Contrato</h4>
        </select>
        <h3>Datos del trabajador</h3>
        <div id="formulario">
        <form method="POST" action="actualizar.php" onsubmit="return validarFormulario()">
        <div class="form-group">
                    <input type="hidden" id="id" name="id" value="<?php echo htmlspecialchars($id); ?>">
                    <input type="hidden" id="nombre_act" name="nombre_act" value="<?php echo htmlspecialchars($_SESSION['user']); ?>">
                    <input type="hidden" id="nivel" name="nivel" value="<?php echo $nivel; ?>">
                    <label for="nombre">Nombre del trabajador</label>
                    <input type="text" id="nombre" name="nombre" value="<?php echo htmlspecialchars($nombre); ?>" required>
                    <label for="puesto">Puesto</label>
                    <input type="text" id="puesto" name="puesto" value="<?php echo htmlspecialchars($puesto); ?>" required>
                    <label for="nacionalidad">Nacionalidad</label>
                    <input type="text" id="nacionalidad" name="nacionalidad" value="<?php echo htmlspecialchars($nacionalidad); ?>" required>
                    <label for="edad">Edad</label>
                    <input type="number" id="edad" min="18" name="edad" value="<?php echo htmlspecialchars($edad); ?>" required>
                    <label for="e_civil">Estado civil</label>
                    <input type="text" id="e_civil" name="e_civil" value="<?php echo htmlspecialchars($e_civil); ?>" required>
                    <label for="rfc">RFC</label>
                    <input type="text" id="rfc" name="rfc" value="<?php echo htmlspecialchars($rfc); ?>" required>
                    <label for="domicilio">Domicilio</label>
                    <input type="text" id="domicilio" name="domicilio" value="<?php echo htmlspecialchars($domicilio); ?>" required>
                    <label for="curp">CURP</label>
                    <input type="text" id="curp" name="curp" value="<?php echo htmlspecialchars($curp); ?>" required>
                    <label for="funciones">Funciones</label>
                    <textarea id="funciones" name="funciones" required wrap="soft"> <?php echo htmlspecialchars($funciones); ?> </textarea>
                    <label for="fechaContrato_d">Fecha de contrato</label>
                    <input type="date" id="fechaContrato_d" name="fechaContrato_d" value="<?php echo htmlspecialchars($fecha_contrato); ?>" required>
                    <label for="fechaTermino_d">Fecha de término de contrato</label>
                    <input type="date" id="fechaTermino_d" name="fechaTermino_d" value="<?php echo htmlspecialchars($fecha_termino); ?>" required>
                    <label for="sueldoMensual">Sueldo mensual</label>
                    <input type="text" id="sueldoMensual" name="sueldoMensual" value="<?php echo htmlspecialchars($sueldo__mensual); ?>" required>
                    <label>Días de trabajo</label>
                    <div>
                        <input type="checkbox" id="lunes_d" name="dias_d[]" value="Lunes"> <label for="lunes_d">Lunes</label>
                        <input type="checkbox" id="martes_d" name="dias_d[]" value="Martes"> <label for="martes_d" >Martes</label>
                        <input type="checkbox" id="miercoles_d" name="dias_d[]" value="Miércoles"> <label for="miercoles_d" >Miércoles</label>
                        <input type="checkbox" id="jueves_d" name="dias_d[]" value="Jueves"> <label for="jueves_d" >Jueves</label>
                        <input type="checkbox" id="viernes_d" name="dias_d[]" value="Viernes"> <label for="viernes_d">Viernes</label>
                        <input type="checkbox" id="sabado_d" name="dias_d[]" value="Sábado"> <label for="sabado_d" >Sábado</label>
                    </div>
                    <label for="horaEntrada_d">Horario de entrada</label>
                    <input type="time" id="horaEntrada_d" name="horaEntrada_d" value="<?php echo htmlspecialchars($hora_entrada); ?>" required>
                    <label for="horaSalida_d">Horario de salida</label>
                    <input type="time" id="horaSalida_d" name="horaSalida_d" value="<?php echo htmlspecialchars($hora_salida); ?>" required>
                <h3>Beneficiarios</h3>
                <div class="form-group">
                    <label for="beneficiario1">Nombre completo</label>
                    <input type="text" id="beneficiario1" name="beneficiario1" value="<?php echo htmlspecialchars($bene1); ?>">
                    <label for="parentesco1">Parentesco</label>
                    <input type="text" id="parentesco1" min="1" max="100" name="parentesco1" value="<?php echo htmlspecialchars($paren1); ?>" >
                    <label for="porcentaje1">Porcentaje</label>
                    <input type="number" id="porcentaje1" min="1" max="100" name="porcentaje1" value="<?php echo htmlspecialchars($porc1); ?>">
                </div>
                <br>
                <div class="form-group">
                    <label for="beneficiario2">Nombre completo</label>
                    <input type="text" id="beneficiario2" name="beneficiario2" value="<?php echo htmlspecialchars($bene2); ?>">
                    <label for="parentesco2">Parentesco</label>
                    <input type="text" id="parentesco2" min="1" max="100" name="parentesco2" value="<?php echo htmlspecialchars($paren2); ?>">
                    <label for="porcentaje2">Porcentaje</label>
                    <input type="number" id="porcentaje2" min="1" max="100" name="porcentaje2" value="<?php echo htmlspecialchars($porc2); ?>">
                </div>                
                <h3>Testigos</h3>
                <div class="form-group">
                    <label for="testigo1">Nombre completo</label>
                    <input type="text" id="testigo1" name="testigo1" value="<?php echo htmlspecialchars($testigo1); ?>">
                    <label for="testigo2">Nombre completo</label>
                    <input type="text" id="testigo2" name="testigo2" value="<?php echo htmlspecialchars($testigo2); ?>">
                </div>
                <button type="submit" class="btn">ACTUALIZAR</button>
            </form>
    </div>

    </div>
</body>
<script>
        function validarFormulario() {
            console.log("hola");

            let nombre1 = document.getElementById("beneficiario1").value.trim();
            let nombre2 = document.getElementById("beneficiario2").value.trim();
            let porcentaje1 = parseFloat(document.getElementById("porcentaje1").value) || 0;
            let porcentaje2 = parseFloat(document.getElementById("porcentaje2").value) || 0;

            if (nombre1 === "") {
                alert("Los nombres de los beneficiarios no pueden estar vacíos");
                return false;
            }
            if (nombre1 === nombre2) {
                alert("Los beneficiarios deben tener nombres diferentes");
                return false;
            }
            if (porcentaje1 + porcentaje2 !== 100) {
                alert("La suma de los porcentajes de beneficiarios debe ser 100%");
                return false;
            }
            console.log("ok");
            return true;
        } 
        function cerrarSesion() {
            alert("Sesión cerrada");
            window.location.href = "logout.php"; 
        }
        let diasSeleccionados = <?php echo json_encode($dias); ?>; // Convierte PHP a JS
        console.log(diasSeleccionados);
        let diasArray = diasSeleccionados.split(','); // ✅ Divide correctamente aunque no haya espacios

    // Recorre los checkboxes y marca los que coincidan
    diasArray.forEach(dia => {
        let checkbox = document.querySelector(`input[value="${dia}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
        
    </script>
</html>
<?php
    }
?>
