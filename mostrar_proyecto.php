<?php	
include('resources/php/session.php');
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   session   session   session   session   session   session   session   session   session   session   session   session   session            //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  session_start();        
  if(                     ////   Aqui se autorizan las personas que pueden ver el reporte
       $_SESSION['username'] != 'armando' 
    && $_SESSION['username'] != 'mario'
    && $_SESSION['username'] != 'david'
    && $_SESSION['username'] != 'laura'
  )
       header('location: index.php'); // Si no estan autorizadas se les redirige a la misma página

setlocale(LC_ALL,"es_ES");

require("fpdf/fpdf.php");

class PDF extends FPDF
{
	function Header()
	{
		$ciclo = date("Y");
		if (date("m")<8) $ciclo -= 2004;
		else 			 $ciclo -= 2003;

		$this->Image('resources/img/logoEducativo.jpg', 5, 5, 20);
		$this->SetFont('Arial','B',16);
		$this->Cell(30);
		$this->Cell(120,10, 'Reporte Becados '.($ciclo+2003).'-'.($ciclo+2004),0,1,'C');
		$this->SetFont('Arial','B',14);
		$this->Cell(185,10, 'Educativo',0,1,'C');
		$this->SetFont('Arial','B',8);
		$this->Cell(185,11, "La Fecha actual es " . date("d")."/".date("m") ."/".date("Y"),0,0,'C');
		$this->Ln(12);
		
	}
	
	function Footer()
	{
		$this->SetY(-15);
		$this->SetFont('Arial','I', 8);
		
	}
}

require_once('conexiones.php');

$ciclo = date("Y");
if (date("m")<8) $ciclo -= 2004;
else 			 $ciclo -= 2003;

$cicloanterior = 0;
if (date("m")<8) $cicloanterior = $ciclo-1;
else 			 $cicloanterior = $ciclo;

$query = 'SELECT 
 	alumno_nivel AS nivelnum,
	(CASE alumno_nivel WHEN 1 THEN "MATERNAL" WHEN 2 THEN "KINDER" WHEN 3 THEN "PRIMARIA" WHEN 4 THEN "SECUNDARIA" END) AS nivel,
	alumno_grado AS grado, 
	(CASE alumno.alumno_grupo WHEN 1 THEN "A" WHEN 2 THEN "B" WHEN 3 THEN "C" WHEN 4 THEN "D" WHEN ISNULL(alumno.alumno_grupo) THEN " " END) AS grupo,
	CONCAT(alumno_app, " ", alumno_apm, " ", alumno_nombre) AS nombre,
	beca_clase AS beca, 
	beca_porcentaje AS porcentaje 
FROM 
		concepto_beca
	JOIN
		alumno_beca
    ON
    	concepto_beca.beca_id=alumno_beca.beca_id
    JOIN
    	alumno
    ON
    	alumno.alumno_id=alumno_beca.alumno_id
WHERE 
	beca_ciclo_escolar = '.$ciclo.' AND 
	beca_estatus = 1 AND
    alumno.alumno_status != 0 
ORDER BY 
nivelnum, nivel, grado, grupo, beca';

$result = mysql_query($query) or die('Consulta fallida: ' . mysql_error());


$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();


$pdf->SetFillColor(232,232,232);
$pdf->SetFont('Arial','B',7);
$pdf->Cell(13, 6, '#', 0, 0, 'C',1);
$pdf->Cell(15, 6, 'Nivel', 0, 0, 'L',1);
$pdf->Cell(7, 6, 'Grado.', 0, 0, 'C',1);
$pdf->Cell(9, 6, 'Grupo', 0, 0, 'L',1);
$pdf->Cell(60, 6, 'Nombre', 0, 0, 'L',1);
$pdf->Cell(25, 6, 'Beca', 0, 0, 'L',1);
$pdf->Cell(25, 6, 'Porcentaje', 0, 1, 'L',1);;

$nx = 0;
$pendiente=array(0,0,0,0);
$pagado=array(0,0,0,0);


while ($row = mysql_fetch_array($result)){
	$nx = $nx + 1;	
	$pdf->Cell(13, 6,$nx, 0, 0, 'C');
	$pdf->Cell(17, 6,$row['nivel'], 0, 0,'L');
	$pdf->Cell(7, 6,$row['grado'], 0, 0,'C');
	$pdf->Cell(7, 6,$row['grupo'], 0, 0,'L');
	$pdf->Cell(60, 6,$row['nombre'], 0, 0);
	$pdf->Cell(25, 6,$row['beca'], 0, 0);
	$pdf->Cell(25, 6,$row['porcentaje'], 0, 1);
	
	//$row['FechaPago']==''? $pendiente[$row['Grado']]++ : $pagado[$row['Grado']]++;
}

/*
$pdf->Ln(12);
$pdf->Cell(15, 6, 'Grado', 0, 0, 'C',1);
$pdf->Cell(17, 6, 'Pendientes', 0, 0, 'C',1);
$pdf->Cell(17, 6, 'Pagados', 0, 0, 'C',1);
$pdf->Cell(15, 6, 'Total', 0, 1, 'C',1);


$pendT=0;
$pagT=0;

for($i=0;$i < sizeof($pendiente);$i++){
	if ($pendiente[$i]>0 || $pagado[$i]>0){
		$pdf->Cell(15, 6, $i , 0, 0, 'C');
		$pdf->Cell(17, 6, $pendiente[$i], 0, 0, 'C');
		$pdf->Cell(17, 6, $pagado[$i], 0, 0, 'C');
		$pdf->Cell(15, 6, $pendiente[$i]+$pagado[$i], 0, 1, 'C');
		$pendT+=$pendiente[$i];
		$pagT+=$pagado[$i];	
	}
}

$pdf->Cell(15, 6, 'Total', 0, 0, 'C',1);
$pdf->Cell(17, 6, $pendT, 0, 0, 'C',1);
$pdf->Cell(17, 6, $pagT, 0, 0, 'C',1);
$pdf->Cell(15, 6, $pendT+$pagT, 0, 1, 'C',1);
*/
$pdf->Output();
?>