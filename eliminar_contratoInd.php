<?php
include 'sql/conection.php'; // Conexión a la BD

// Validar que el id esté presente
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Preparar y ejecutar la eliminación
    $stmt = $conexion->prepare("DELETE FROM contrato_indeterminado WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Registro eliminado correctamente.";
    } else {
        echo "Error al eliminar el registro.";
    }

    $stmt->close();
} else {
    echo "ID no proporcionado.";
}

$conexion->close();
?>