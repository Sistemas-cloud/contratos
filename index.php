<?php
session_start();
require_once('sql/conection.php');
if (isset($_SESSION['user'])) {
    header("Location: main.php");
    exit();
}


$error = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
        
    $stmt = $conexion->prepare("SELECT * FROM usuario WHERE usuario_username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result); // Obtener la fila como un array asociativo
        if($password == $row['usuario_password']){
            $_SESSION['user'] = $row['usuario_nombre'] . " " . $row['usuario_app'] . " " . $row['usuario_apm'];
            $_SESSION['permiso'] = $row['usuario_id'];
            $_SESSION['nivel'] = $row['nivel'];
            header("Location: main.php");
            exit();
        }else{
            $error = "Contraseña incorrecta.";
        }
    } else {
        $error = "Usuario desconocido.";
    }
    
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>
<body>
    
    <div class="login-container">
        <h2>Iniciar sesión</h2>
        <?php if ($error): ?><div class="alert alert-danger"> <?php echo $error; ?> </div><?php endif; ?>
        <form action="" method="POST">
            <div class="mb-3">
                <input type="text" name="username" class="form-control" placeholder="Usuario" required>
            </div>
            <div class="mb-3">
                <input type="password" name="password" class="form-control" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Entrar</button>
        </form>
    </div>
</body>
</html>