<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
} 
include 'sql/conection.php'; // Conexiones a la BD
// Obtener registros
$nivel = $_SESSION['nivel'];
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
        <h4>Agregar Registro</h4>
        
    <label for="tipoContrato">Seleccionar contrato:</label>
        <select id="tipoContrato" onchange="mostrarFormulario()">
            <option value="">Seleccione una opción</option>
            <option value="determinado">Tiempo de Prueba</option>
            <option value="indeterminado">Contrato Indeterminado</option>
            <option value="porHora">Tiempo Determinado por Hora</option>
            <!-- <option value="proyecto">Contrato Prueba</option> -->

             <!-- Campo oculto para enviar valores específicos -->
        </select>
        <h3>Datos del trabajador</h3>
        <div id="formulario" class="hidden">
        <form method="POST" action="procesar.php" onsubmit="return validarFormulario()">
        <div class="form-group">
                    <input type="hidden" id="valorContrato" name="valorContrato">
                    <input type="hidden" id="nombre_act" name="nombre_act" value="<?php echo htmlspecialchars($_SESSION['user']); ?>">
                    <input type="hidden" id="nivel" name="nivel" value="<?php echo $nivel; ?>">
                    <label for="nombre">Nombre del trabajador</label>
                    <input type="text" id="nombre" name="nombre"required>
                    <label for="puesto">Puesto</label>
                    <input type="text" id="puesto" name="puesto" required>
                    <label for="nacionalidad">Nacionalidad</label>
                    <input type="text" id="nacionalidad" name="nacionalidad" required>
                    <label for="edad">Edad</label>
                    <input type="number" id="edad" min="18" name="edad" required>
                    <label for="e_civil">Estado civil</label>
                    <input type="text" id="e_civil" name="e_civil" required>
                    <label for="rfc">RFC</label>
                    <input type="text" id="rfc" name="rfc" required>
                    <label for="domicilio">Domicilio</label>
                    <input type="text" id="domicilio" name="domicilio" required>
                    <label for="curp">CURP</label>
                    <input type="text" id="curp" name="curp" required>
                    <label for="funciones">funciones</label>
                    <textarea id="funciones" name="funciones" required wrap="soft"></textarea>
                </div>
                <div class="form-group">                    
                </div>                
                <div id="determinado" class="hidden form-group">
                    
                    <label for="fechaContrato_d">Fecha de contrato</label>
                    <input type="date" id="fechaContrato_d" name="fechaContrato_d">
                    <label for="fechaTermino_d">Fecha de término de contrato</label>
                    <input type="date" id="fechaTermino_d" name="fechaTermino_d">
                    <label for="sueldoMensual">Sueldo mensual</label>
                    <input type="text" id="sueldoMensual" name="sueldoMensual" >
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
                    <input type="time" id="horaEntrada_d" name="horaEntrada_d" step="1">
                    <label for="horaSalida_d">Horario de salida</label>
                    <input type="time" id="horaSalida_d" name="horaSalida_d" step="1">
                </div>
                
                <div id="indeterminado" class="hidden form-group">
                    <label for="fecha_leido">Fecha de lectura</label>
                    <input type="date" id="fecha_leido" name="fecha_leido">
                    <label for="fechaInicio_ind" >Fecha de Inicio</label>
                    <input type="date" id="fechaInicio_ind" name="fechaInicio_ind">
                    <label for="fechaContrato_ind">Fecha de contrato</label>
                    <input type="date" id="fechaContrato_ind" name="fechaContrato_ind">
                    <label for="salarioTotal">Salario mensual de percepciones</label>
                    <input type="text" id="salarioTotal" name="salarioTotal" >
                    <label>Días de trabajo</label>
                    <div>
                        <input type="checkbox" id="lunes_ind" name="dias_ind[]" value="Lunes"> <label for="lunes_ind">Lunes</label>
                        <input type="checkbox" id="martes_ind" name="dias_ind[]" value="Martes"> <label for="martes_ind">Martes</label>
                        <input type="checkbox" id="miercoles_ind" name="dias_ind[]" value="Miércoles"> <label for="miercoles_ind">Miércoles</label>
                        <input type="checkbox" id="jueves_ind" name="dias_ind[]" value="Jueves"> <label for="jueves_ind">Jueves</label>
                        <input type="checkbox" id="viernes_ind" name="dias_ind[]" value="Viernes"> <label for="viernes_ind">Viernes</label>
                        <input type="checkbox" id="sabado_ind" name="dias_ind[]" value="Sábado"> <label for="sabado_ind">Sábado</label>
                    </div>
                    <label for="horaEntrada_ind">Horario de entrada</label>
                    <input type="time" id="horaEntrada_ind" name="horaEntrada_ind" step="1">
                    <label for="horaSalida_ind">Horario de salida</label>
                    <input type="time" id="horaSalida_ind" name="horaSalida_ind" step="1">
                </div>
                
                <div id="porHora" class="hidden form-group">
                    <label for="fechaInicioEsc">Fecha de Inicio Ciclo Escolar</label>
                    <input type="date" id="fechaInicioEsc" name="fechaInicioEsc">
                    <label for="fechaTerminoEsc">Fecha de Termino Ciclo Escolar</label>
                    <input type="date" id="fechaTerminoEsc" name="fechaTerminoEsc">
                    <label for="fechaContrato_hora">Fecha de contrato</label>
                    <input type="date" id="fechaContrato_hora" name="fechaContrato_hora">
                    <label>Días de trabajo</label>
                    <div>
                        <input type="checkbox" id="lunes_hora" name="dias_hora[]" value="Lunes"> <label for="lunes_hora">Lunes</label>
                        <input type="checkbox" id="martes_hora" name="dias_hora[]" value="Martes"> <label for="martes_hora">Martes</label>
                        <input type="checkbox" id="miercoles_hora" name="dias_hora[]" value="Miércoles"> <label for="miercoles_hora">Miércoles</label>
                        <input type="checkbox" id="jueves_hora" name="dias_hora[]" value="Jueves"> <label for="jueves_hora">Jueves</label>
                        <input type="checkbox" id="viernes_hora" name="dias_hora[]" value="Viernes"> <label for="viernes_hora">Viernes</label>
                        <input type="checkbox" id="sabado_hora" name="dias_hora[]" value="Sábado"> <label for="sabado_hora">Sábado</label>
                    </div>
                    <label for="horaEntrada_hora">Horario de entrada</label>
                    <input type="time" id="horaEntrada_hora" name="horaEntrada_hora" step="1">
                    <label for="horaSalida_hora">Horario de salida</label>
                    <input type="time" id="horaSalida_hora" name="horaSalida_hora" step="1">
                    <label for="costoHora">Costo por hora</label>
                    <input type="text" id="costoHora" name="costoHora" >
                </div>
                
                <div id="proyecto" class="hidden form-group">
                    <label for="nombreProyecto">Nombre del Proyecto</label>
                    <input type="text" id="nombreProyecto" >
                    <label for="montoPagoProyecto">Monto total de pago</label>
                    <input type="text" id="montoPagoProyecto" >
                </div>
                
                <h3>Beneficiarios</h3>
                <div class="form-group">
                    <label for="beneficiario1">Nombre completo</label>
                    <input type="text" id="beneficiario1" name="beneficiario1">
                    <label for="parentesco1">Parentesco</label>
                    <input type="text" id="parentesco1" min="1" max="100" name="parentesco1">
                    <label for="porcentaje1">Porcentaje</label>
                    <input type="number" id="porcentaje1" min="1" max="100" name="porcentaje1">
                </div>
                <div class="form-group">
                    <label for="beneficiario2">Nombre completo</label>
                    <input type="text" id="beneficiario2" name="beneficiario2">
                    <label for="parentesco2">Parentesco</label>
                    <input type="text" id="parentesco2" min="1" max="100" name="parentesco2">
                    <label for="porcentaje2">Porcentaje</label>
                    <input type="number" id="porcentaje2" min="1" max="100" name="porcentaje2">
                </div>
                <h3>Testigos</h3>
                <div class="form-group">
                    <label for="testigo1">Nombre completo</label>
                    <input type="text" id="testigo1" name="testigo1">
                    <label for="testigo2">Nombre completo</label>
                    <input type="text" id="testigo2" name="testigo2">
                </div>
                
                
                <button type="submit" class="btn">Guardar</button>
            </form>
    </div>
    
    <h4>Registros</h4>
<!-- Tabla para Contrato Determinado -->
<div class="table-responsive" id="tabla_determinado" style="display:none;">
    <h3>Contratos de Tiempo Determinado</h3>
    <table class="table table-dark table-striped mt-3">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Nacionalidad</th>
                <th>Edad</th>
                <th>Edo. civil</th>
                <th>RFC</th>
                <th>Domicilio</th>
                <th>CURP</th>
                <th>Fecha Contrato</th>
                <th>Fecha Termino</th>
                <th>Sueldo Mensual</th>
                <th>Días</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Funciones</th>
                <th>Beneficiario1</th>
                <th>Parentesco1</th>
                <th>%</th>
                <th>Beneficiario2</th>
                <th>Parentesco2</th>
                <th>%</th>
                <th>Ultima Actualizacón</th>
                <th>Nombre Actualización</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!--PHP para mostrar los datos -->
            <?php include('mostrar_determinado.php'); ?>
        </tbody>
    </table>
</div>

<!-- Tabla para Contrato Indeterminado -->
<div class="table-responsive" id="tabla_indeterminado" style="display:none;">
    <h3>Contratos de Tiempo Indeterminado</h3>
    <table class="table table-dark table-striped mt-3">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Nacionalidad</th>
                <th>Edad</th>
                <th>Edo. civil</th>
                <th>RFC</th>
                <th>Domicilio</th>
                <th>CURP</th>
                <th>Fecha Leido</th>
                <th>Fecha Inicio</th>
                <th>Fecha Contrato</th>
                <th>Salario</th>
                <th>Días</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Funciones</th>
                <th>Beneficiario1</th>
                <th>Parentesco1</th>
                <th>%</th>
                <th>Beneficiario2</th>
                <th>Parentesco2</th>
                <th>%</th>
                <th>Ultima Actualizacón</th>
                <th>Nombre Actualización</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Aquí va tu PHP para mostrar los datos -->
            <?php include('mostrar_indeterminado.php'); ?>

        </tbody>
    </table>
</div>

<!-- Tabla para Contrato por Hora -->
<div class="table-responsive" id="tabla_porHora" style="display:none;">
    <h3>Contratos por Hora</h3>
    <table class="table table-dark table-striped mt-3">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Nacionalidad</th>
                <th>Edad</th>
                <th>Edo. civil</th>
                <th>RFC</th>
                <th>Domicilio</th>
                <th>CURP</th>
                <th>Fecha Inicio Escolar</th>
                <th>Fecha Termino Escolar</th>
                <th>Fecha Contrato</th>
                <th>Días</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Costo Hora</th>
                <th>Funciones</th>
                <th>Beneficiario1</th>
                <th>Parentesco1</th>
                <th>%</th>
                <th>Beneficiario2</th>
                <th>Parentesco2</th>
                <th>%</th>
                <th>Ultima Actualizacón</th>
                <th>Nombre Actualización</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Aquí va tu PHP para mostrar los datos -->
            <?php include('mostrar_porHora.php'); ?>

        </tbody>
    </table>
</div>

<!-- Tabla para Contrato de Proyecto -->
<div class="table-responsive" id="tabla_proyecto" style="display:none;">
    <h3>Contratos de Proyecto</h3>
    <table class="table table-dark table-striped mt-3">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Descripción</th>
                <th>Fecha Registro</th>
                <th>RFC</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Aquí va tu PHP para mostrar los datos -->
        </tbody>
    </table>
</div>
    </div>
</body>
<script>
       function mostrarFormulario() {
            // Mostrar el formulario general
            document.getElementById('formulario').classList.remove('hidden');

            // Ocultar todos los formularios específicos
            document.getElementById('determinado').classList.add('hidden');
            document.getElementById('indeterminado').classList.add('hidden');
            document.getElementById('porHora').classList.add('hidden');
            document.getElementById('proyecto').classList.add('hidden');

            // Obtener el tipo de contrato seleccionado
            const tipo = document.getElementById('tipoContrato').value;

            // Mostrar el formulario correspondiente
            if (tipo) {
                document.getElementById(tipo).classList.remove('hidden');
            }
            console.log("tipo: " + tipo);
            document.getElementById("valorContrato").value = tipo;


            // Llamar a la función para actualizar los valores
            //actualizarValores(tipo);

            // Ocultamos todas las tablas al inicio
            document.getElementById("tabla_determinado").style.display = "none";
            document.getElementById("tabla_indeterminado").style.display = "none";
            document.getElementById("tabla_porHora").style.display = "none";
            document.getElementById("tabla_proyecto").style.display = "none";

            // Obtenemos el valor del select
            var tipoContrato = document.getElementById("tipoContrato").value;

            // Mostramos la tabla correspondiente según el tipo seleccionado
            if (tipoContrato == "determinado") {
                document.getElementById("tabla_determinado").style.display = "block";
            } else if (tipoContrato == "indeterminado") {
                document.getElementById("tabla_indeterminado").style.display = "block";
            } else if (tipoContrato == "porHora") {
                document.getElementById("tabla_porHora").style.display = "block";
            } else if (tipoContrato == "proyecto") {
                document.getElementById("tabla_proyecto").style.display = "block";
            }
        }

        function actualizarValores(tipoContrato) {
            var valorContrato = "";

            // Asignar valores específicos según el tipo de contrato
            switch (tipoContrato) {
                case "determinado":
                    valorContrato = "TD-001";
                    break;
                case "indeterminado":
                    valorContrato = "TI-002";
                    break;
                case "porHora":
                    valorContrato = "TH-003";
                    break;
                case "proyecto":
                    valorContrato = "CP-004";
                    break;
                default:
                    valorContrato = "";
            }

            // Asignar el valor al campo oculto
            document.getElementById("tipoContrato").value = valorContrato;
            const cont = document.getElementById('tipoContrato').value;
            console.log("contrato: " + cont);
        }

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
    </script>
</html>
