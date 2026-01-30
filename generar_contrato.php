<?php
ob_start(); // activa el buffer de salida
require('fpdf17/fpdf.php'); // Incluir la librería FPDF
include 'sql/conection.php'; // Conexión a la BD

if (isset($_GET['id'])) {
 $id = $_GET['id']; // Obtener el ID desde la URL
 
 function numeroATexto($numero) {
    // Eliminar comas y convertir a float
    $numero = (float)str_replace(',', '', $numero);
    
    $unidad = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    $decena = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    $especiales = [10 => 'diez', 11 => 'once', 12 => 'doce', 13 => 'trece', 14 => 'catorce', 15 => 'quince', 16 => 'dieciséis', 
                   17 => 'diecisiete', 18 => 'dieciocho', 19 => 'diecinueve'];

    if ($numero == 0) {
        return 'cero';
    } elseif ($numero < 10) {
        return $unidad[$numero];
    } elseif ($numero < 20) {
        return $especiales[$numero];
    } elseif ($numero < 100) {
        $dec = (int)($numero / 10);
        $unid = $numero % 10;
        if ($unid == 0) {
            return $decena[$dec];
        } else {
            return $decena[$dec] . ' y ' . $unidad[$unid];
        }
    } elseif ($numero < 1000) {
        $cent = (int)($numero / 100);
        $resto = $numero % 100;
        if ($cent == 1) {
            $prefijo = $resto == 0 ? 'cien' : 'ciento';
        } elseif ($cent == 5) {
            $prefijo = 'quinientos';
        } elseif ($cent == 7) {
            $prefijo = 'setecientos';
        } elseif ($cent == 9) {
            $prefijo = 'novecientos';
        } else {
            $prefijo = $unidad[$cent] . 'cientos';
        }
        return $resto == 0 ? $prefijo : $prefijo . ' ' . numeroATexto($resto);
    } elseif ($numero < 1000000) {
        $mil = (int)($numero / 1000);
        $resto = $numero % 1000;
        if ($mil == 1) {
            $prefijo = 'mil';
        } else {
            $prefijo = numeroATexto($mil) . ' mil';
        }
        return $resto == 0 ? $prefijo : $prefijo . ' ' . numeroATexto($resto);
    }
    return 'Número demasiado grande';
}


function numeroATextoPesos($numero) {
    $entero = floor($numero);
    $decimales = round(($numero - $entero) * 100);

    // Función original para la parte entera
    $texto_entero = numeroATexto($entero);

    // Formato de decimales
    $texto_decimales = str_pad($decimales, 2, '0', STR_PAD_LEFT);

    $texto_entero = "$texto_entero pesos $texto_decimales/100 M.N.";
    return $texto_entero;
}

function fechaATexto($fecha) {
    $meses = [
        1 => 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    $fecha_parts = explode('-', $fecha);
    $dia = (int)$fecha_parts[2];
    $mes = $meses[(int)$fecha_parts[1]];
    $anio = $fecha_parts[0];
    return "$dia DE $mes DEL $anio";
}
 // Consulta para los contratos de tiempo determinado
 $query = "SELECT * FROM contrato_determinado where id = '$id'";
 $result = $conexion->query($query);
 
 // Verifica si hay resultados
 if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()) {
        $nombre = $row['nombre'];
        $puesto = $row['puesto'];
        $puesto = $row['nacionalidad'];
        $edad = $row['edad'];
        $e_civil = $row['e_civil'];
        $rfc = $row['rfc'];
        $domicilio = $row['domicilio'];
        $curp = $row['curp'];
        $fecha_contrato = $row['fecha_contrato'];
        $fecha_termino = $row['fecha_termino'];
        $salario = $row['sueldo_mensual'];
        $dias = $row['dias'];
        $hora_entrada = $row['hora_entrada'];
        $hora_salida = $row['hora_salida'];
        $fecha_registro = $row['fecha_registro'];
        $puesto = $row['puesto'];
        $nivel = $row['nivel'];
        $bene1 = $row['bene1'];
        $paren1 = $row['paren1'];
        $porc1 = $row['porc1'];
        $bene2 = $row['bene2'];
        $paren2 = $row['paren2'];
        $porc2 = $row['porc2'];
        $funciones = $row['funciones'];
        $testigo1 = $row['testigo1'];
        $testigo2 = $row['testigo2'];
    }
 }
 $lista_funciones = explode('-', $funciones); // Divide la cadena por comas
 $sueldo_mensual_double = (double) $salario;
 $sueldo_mensual_texto = numeroATextoPesos($sueldo_mensual_double);
 $sueldo_mensual_double = number_format((double) $salario, 2, '.', ',');

// Convertir la fecha del contrato a texto
$fecha_contrato_texto = fechaATexto($fecha_contrato);
 // Función para convertir una fecha en formato YYYY-MM-DD a texto

$hora_entrada_12 = date("g:i a", strtotime($hora_entrada));
$hora_salida_12 = date("g:i a", strtotime($hora_salida));
$horario_12 = $hora_entrada . " - " . $hora_salida;

 class PDF extends FPDF {
    function Header() {
    }
    
    function Footer() {
    }
    function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
    {
        $k=$this->k;
        if($this->y+$h>$this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak())
        {
            $x=$this->x;
            $ws=$this->ws;
            if($ws>0)
            {
                $this->ws=0;
                $this->_out('0 Tw');
            }
            $this->AddPage($this->CurOrientation);
            $this->x=$x;
            if($ws>0)
            {
                $this->ws=$ws;
                $this->_out(sprintf('%.3F Tw',$ws*$k));
            }
        }
        if($w==0)
            $w=$this->w-$this->rMargin-$this->x;
        $s='';
        if($fill || $border==1)
        {
            if($fill)
                $op=($border==1) ? 'B' : 'f';
            else
                $op='S';
            $s=sprintf('%.2F %.2F %.2F %.2F re %s ',$this->x*$k,($this->h-$this->y)*$k,$w*$k,-$h*$k,$op);
        }
        if(is_string($border))
        {
            $x=$this->x;
            $y=$this->y;
            if(is_int(strpos($border,'L')))
                $s.=sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-$y)*$k,$x*$k,($this->h-($y+$h))*$k);
            if(is_int(strpos($border,'T')))
                $s.=sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-$y)*$k,($x+$w)*$k,($this->h-$y)*$k);
            if(is_int(strpos($border,'R')))
                $s.=sprintf('%.2F %.2F m %.2F %.2F l S ',($x+$w)*$k,($this->h-$y)*$k,($x+$w)*$k,($this->h-($y+$h))*$k);
            if(is_int(strpos($border,'B')))
                $s.=sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-($y+$h))*$k,($x+$w)*$k,($this->h-($y+$h))*$k);
        }
        if($txt!='')
        {
            if($align=='R')
                $dx=$w-$this->cMargin-$this->GetStringWidth($txt);
            elseif($align=='C')
                $dx=($w-$this->GetStringWidth($txt))/2;
            elseif($align=='FJ')
            {
                //Set word spacing
                $wmax=($w-2*$this->cMargin);
                $nb=substr_count($txt,' ');
                if($nb>0)
                    $this->ws=($wmax-$this->GetStringWidth($txt))/$nb;
                else
                    $this->ws=0;
                $this->_out(sprintf('%.3F Tw',$this->ws*$this->k));
                $dx=$this->cMargin;
            }
            else
                $dx=$this->cMargin;
            $txt=str_replace(')','\\)',str_replace('(','\\(',str_replace('\\','\\\\',$txt)));
            if($this->ColorFlag)
                $s.='q '.$this->TextColor.' ';
            $s.=sprintf('BT %.2F %.2F Td (%s) Tj ET',($this->x+$dx)*$k,($this->h-($this->y+.5*$h+.3*$this->FontSize))*$k,$txt);
            if($this->underline)
                $s.=' '.$this->_dounderline($this->x+$dx,$this->y+.5*$h+.3*$this->FontSize,$txt);
            if($this->ColorFlag)
                $s.=' Q';
            if($link)
            {
                if($align=='FJ')
                    $wlink=$wmax;
                else
                    $wlink=$this->GetStringWidth($txt);
                $this->Link($this->x+$dx,$this->y+.5*$h-.5*$this->FontSize,$wlink,$this->FontSize,$link);
            }
        }
        if($s)
            $this->_out($s);
        if($align=='FJ')
        {
            //Remove word spacing
            $this->_out('0 Tw');
            $this->ws=0;
        }
        $this->lasth=$h;
        if($ln>0)
        {
            $this->y+=$h;
            if($ln==1)
                $this->x=$this->lMargin;
        }
        else
            $this->x+=$w;
    }
 } 
 
 $pdf = new PDF();
 $pdf->SetMargins(25, 15, 25); // Márgenes: Izq 20mm, Sup 15mm, Der 20mm
 $pdf->SetAutoPageBreak(true, 15); // Margen inferior de 15mm
 $pdf->AddPage();
 $pdf->SetFont('Arial', 'B', 8);
 $pdf->Cell(0, 5, 'CONTRATO INDIVIDUAL DE TRABAJO', 0, 1, 'C');
 $pdf->Ln(2);
 $text = 'CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO DETERMINADO, que celebran por una parte el INSTITUTO WINSTON CHURCHILL, A.C. representada en este acto por la C. Ana Matilde Ávila Azuara en su calidad de Representante Legal en lo sucesivo "EL PATRON" y por la otra el C. '.$nombre.', a quien en lo sucesivo se le denominará "EL TRABAJADOR", quienes están conformes en sujetarse al tenor de los siguientes DECLARACIONES Y CLAUSULAS:';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 //declaraciones
 $pdf->SetFont('Arial', 'B', 8);
 $pdf->Cell(0, 5, 'DECLARACIONES', 0, 1, 'C');
 $pdf->Ln(2);
 $pdf->SetFont('Arial', '', 8); // Establecer una fuente apropiada
 $text = 'I) "EL PATRON" INSTITUTO WINSTON CHURCHILL, A.C. declara a través de su representante:';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $pdf->SetFont('Arial', '', 8);
 $text = '1.- Ser una persona moral legalmente constituida bajo la Ley General de Sociedades Mercantiles con el Instrumento Público número nueve mil cuatrocientos veintidós, Volumen doscientos cuarenta, de fecha veintitrés de julio de mil novecientos noventa y nueve, ante la fe del LIC. FRANCISCO HACES ARGUELLES, titular de la Notaría Pública Número 38, con ejercicio en el Segundo Distrito Judicial del Estado, que comprende los municipios de Tampico, Ciudad Madero y Altamira, e inscrita debidamente en el Registro Público del Comercio en Tampico, Tamaulipas con domicilio fiscal en calle 3 número 309, colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas y legalmente representada por la C. Ing. Ana Matilde Ávila Azuara, que cuenta con facultades suficientes para celebrar el presente convenio, acreditando su personalidad en términos del documento ya mencionado, facultades que a la fecha no le han sido revocadas o modificadas en forma alguna.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = '2.- Que tiene como objeto social principalmente la enseñanza, con autorización o con reconocimiento de validez oficial de estudios en los términos de la Ley General de Educación.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = '3.- Que requiere contratar de los servicios del TRABAJADOR para que se desempeñe en el puesto de '.$puesto.'.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $pdf->MultiCell(0, 5, 'II) "EL TRABAJADOR", por sus propios derechos manifiesta:');
 $pdf->Ln(2);
 $text = '1.- Bajo protesta de decir verdad, llamarse C. '.$nombre.', ser de nacionalidad mexicana, tener '.$edad.' años de edad, estado civil '.$e_civil.', con RFC '.$rfc.', domicilio en '.$domicilio.', con CURP '.$curp.'.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = '2.- Manifiesta que tiene la capacidad y aptitudes para desarrollarse en el puesto referido en la declaración I inciso 3.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = '3.- "EL TRABAJADOR" está conforme en desempeñar los requerimientos de la empresa y en plasmar en el presente proemio las condiciones generales de trabajo sobre las cuales prestará sus servicios personales.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $pdf->MultiCell(0, 5, 'III) "AMBAS PARTES" acuerdan:');
 $pdf->Ln(2);
 $text = '1.- Se reconocen mutuamente como "TRABAJADOR" Y "PATRÓN", Por lo que desde este momento "EL TRABAJADOR " acepta que "EL PATRON " es su única fuente de empleo, así como "EL PATRON " reconoce a "EL TRABAJADOR " como su empleado y sus responsabilidades legales para con él.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'Bajo protesta de decir verdad ambas partes manifiestan que son verídicos todos los datos que se plasman en presente ocurso, así como, que es su libre voluntad sujetarse al contenido de las siguientes:';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 //Clausulas
 $pdf->SetFont('Arial', 'B', 8);
 $pdf->Cell(0, 5, 'CLAUSULAS', 0, 1, 'C');
 $pdf->Ln(2); 
 $pdf->SetFont('Arial', '', 8);
 $text = 'PRIMERA. - En lo consecuente dentro de este proemio, a la Ley Federal del Trabajo se le conocerá como "LA LEY"; al referirse al presente documento como "EL CONTRATO", y a los que lo suscriben como "LAS PARTES".';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'SEGUNDA. - "EL CONTRATO" se celebra por TIEMPO DETERMINADO sujeto a capacitación inicial según lo establece el artículo 35 de "LA LEY". La vigencia de la relación de trabajo tendrá una duración de 90 días, el cual computará a partir de la fecha de la firma del presente contrato hasta el '.$fecha_termino.' , sujetándose a una evaluación al cumplir los primeros 30 días laborando, donde de no acreditar competencia el trabajador, a juicio de "EL PATRON", se dará por terminada la relación de trabajo, sin responsabilidad para el patrón. En el supuesto que la fuente de trabajo se agote o se extinga previo al término establecido se hace del conocimiento a "EL TRABAJADOR" que la relación contractual quedará extinta ante la inexistencia de la fuente de trabajo.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'El presente contrato obliga a lo expresamente pactado conforme a las disposiciones contenidas en el artículo 195 de la Ley Federal del Trabajo, y la duración del mismo será la señalada en el párrafo anterior, por lo que al concluir dicho término las partes contratantes lo darán por terminado, sin responsabilidad alguna para ambas partes.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'Asimismo, convienen los contratantes que, si vencido el término fijado en la cláusula segunda subsiste la materia de trabajo, este instrumento se prorrogará única y exclusivamente por el tiempo que dure dicha circunstancia sin necesidad de celebrar uno nuevo, y al agotarse ésta, terminará también la relación laboral, en términos del artículo 39 de la Ley Federal del Trabajo.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'TERCERA. - "EL TRABAJADOR" tendrá como domicilio fijo de su fuente de trabajo, para la prestación de los servicios, el ubicado en calle 3 número 309, colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas;
"LAS PARTES" acuerdan que dicho domicilio podrá ser modificado de acuerdo a las necesidades de "EL PATRON", previo aviso por escrito a "EL TRABAJADOR". Para el caso que en el nuevo lugar de prestación de servicios que le fuera lasignado variara el horario de labores, "EL TRABAJADOR" acepta allanarse a dicha modalidad.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'CUARTA. - "EL TRABAJADOR" se desempeñará en el puesto de '.$puesto.', y sus funciones consistirán, de manera enunciativa, más no limitativa en:';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 // Recorrer cada función y agregarla como una viñeta
foreach ($lista_funciones as $funcion) {
    $funcion = trim($funcion); // Eliminar espacios en blanco extra
    if (!empty($funcion)) {
        $texto = '- '. $funcion;
        $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $texto));
    }
}
 $pdf->Ln(2);
 $text = 'QUINTA. - "EL TRABAJADOR" se obliga desempeñar los trabajos descritos en la cláusula que antecede, así como cualquier actividad conexa a su ocupación principal siempre que se trate del trabajo contratado, así mismo de acuerdo a las necesidades del Instituto se podrán realizar cambios de áreas y roles establecidos, cumpliendo para tal efecto con las instrucciones que reciba de "EL PATRON" o representantes facultados para ello.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'SEXTA. - "EL PATRON y "EL TRABAJADOR" convienen en los términos del artículo 59 de la Ley Federal de Trabajo que la duración de la jornada de trabajo será de 48 horas semanales, dividiéndose de lunes a sábado entre las '.$horario_12.' horas, dispondrá de tiempo para consumir sus alimentos, con descanso fijo el día domingo de cada semana, así como días de descanso obligatorio que establece la Ley Federal de Trabajo con goce de sueldo.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'SÉPTIMA. - "EL TRABAJADOR", por razón de su puesto, únicamente podrá laborar tiempo extraordinario cuando "EL PATRÓN" se lo indique y mediante orden por escrito, la que señalará el día o los días y el horario en el cual se desempeñará el mismo. Para el caso de computar el tiempo extraordinario laborado deberá "EL TRABAJADOR " recabar y conservar la orden referida a fin de que en su momento quede debidamente pagado el tiempo extra laborado; la falta de presentación de esa orden sólo es imputable al "TRABAJADOR". "AMBAS PARTES" manifiestan que salvo esta forma queda prohibido en el centro de trabajo pagar horas extras.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'OCTAVA. - "EL TRABAJADOR" percibirá por la prestación de sus servicios como salario mensual la cantidad de $'.$sueldo_mensual_double.' ('.$sueldo_mensual_texto.'). Dicho salario será cubierto a mes vencido mediante 2-dos quincenas los días 15 y 30 de cada mes, estando incluido en su salario quincenal el pago de los séptimos días y días festivos y/o descanso obligatorio. El pago se hará dentro de su jornada de trabajo o inmediatamente después a la conclusión de la misma en el en el lugar de la prestación de sus servicios, sin perjuicio de que el pago se haga en los términos estipulados en el párrafo siguiente: El salario se pagará en efectivo, otorgando "EL TRABAJADOR " su consentimiento para que se le pague su salario de esa manera, lo anterior con fundamento en el artículo 101 de la Ley Federal del Trabajo. Las partes convienen que "EL TRABAJADOR " deberá firmar recibos impresos por la totalidad de los salarios ordinarios, extraordinarios y demás prestaciones que perciba, manifestando "EL TRABAJADOR " su conformidad al respecto.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'NOVENA. - "EL TRABAJADOR" tendrá derecho por cada seis días de labores a descansar uno con el pago de salario diario correspondiente. Quedan establecidos como días de descanso obligatorio los señalados en el artículo 74 de "LA LEY ".';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA. - "EL TRABAJADOR" tendrá derecho a recibir por parte de "EL PATRON ", antes del día 20 de diciembre de cada año el importe correspondiente a quince días de salario como pago del aguinaldo a que se refiere el artículo 87 de la Ley Federal de Trabajo, o su parte proporcional al tiempo laborado en caso de que este sea menor a un año.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA PRIMERA. - "EL TRABAJADOR" será capacitado o adiestrado en los términos de los planes y programas establecidos (o que se establezcan), por "EL PATRÓN ", conforme a lo dispuesto en el Capítulo III Bis, Titulo Cuarto de la Ley Federal del Trabajo.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA SEGUNDA. - "EL TRABAJADOR " acepta someterse a los exámenes médicos que periódicamente establezca "EL PATRON " en los términos del artículo 134 Fracción X de "LA LEY ", a fin de mantener en forma óptima sus facultades físicas e intelectuales, para el mejor desempeño de sus funciones. El médico que practique los reconocimientos será designado y retribuido por la "EL PATRON ".';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA TERCERA. - "EL TRABAJADOR " deberá observar y cumplir las disposiciones contenidas en el Reglamento Interior de Trabajo con sus respectivas modificaciones que se encuentra establecido, mismo que en este acto de le da a conocer, firmando de leído y conforme, obligándose a cumplirlo en todas y cada una de sus partes.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA CUARTA. - "EL TRABAJADOR " se obliga a observar todas las disposiciones y medidas de seguridad e higiene respectivas, así como en su caso a formar parte de las comisiones mixtas que sean necesarias, y participar en los cursos que se impartan sobre esta materia.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA QUINTA. - "EL TRABAJADOR " acepta y se obliga a cumplir todo lo contenido los artículos 134 y 135 de " LA LEY " y que corresponde a las obligaciones y prohibiciones de los trabajadores en el desempeño de sus labores al servicio de " ELPATRON ", el cual literalmente se transcribe a continuación:';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
$obligaciones = [
    'I.- Cumplir las disposiciones de las normas de trabajo que les sean aplicables;',
    'II.- Observar las disposiciones contenidas en el reglamento y las normas oficiales mexicanas en materia de seguridad, salud y medio ambiente de trabajo, así como las que indiquen los patrones para su seguridad y protección personal;',
    'III.- Desempeñar el servicio bajo la dirección del patrón o de su representante, a cuya autoridad estarán subordinados en todo lo concerniente al trabajo;',
    'IV.- Ejecutar el trabajo con la intensidad, cuidado y esmero apropiados y en la forma, tiempo y lugar convenidos;',
    'V.- Dar aviso inmediato al patrón, salvo caso fortuito o de fuerza mayor, de las causas justificadas que le impidan concurrir a su trabajo;',
    'VI.- Restituir al patrón los materiales no usados y conservar en buen estado los instrumentos y útiles que les haya dado para el trabajo, no siendo responsables por el deterioro que origine el uso de estos objetos, ni del ocasionado por caso fortuito, fuerza mayor, o por mala calidad o defectuosa construcción;',
    'VII.- Observar buenas costumbres durante el servicio;',
    'VIII.- Prestar auxilios en cualquier tiempo que se necesiten, cuando por siniestro o riesgo inminente peligren las personas o los intereses del patrón o de sus compañeros de trabajo;',
    'IX.- Integrar los organismos que establece esta Ley;',
    'X.- Someterse a los reconocimientos médicos previstos en el reglamento interior y demás normas vigentes en la empresa o establecimiento, para comprobar que no padecen alguna incapacidad o enfermedad de trabajo, contagiosa o incurable;',
    'XI.- Poner en conocimiento del patrón las enfermedades contagiosas que padezcan, tan pronto como tengan conocimiento de las mismas;',
    'XII.- Comunicar al patrón o a su representante las deficiencias que adviertan, a fin de evitar daños o perjuicios a los intereses y vidas de sus compañeros de trabajo o de los patrones;',
    'XIII.- Guardar escrupulosamente los secretos técnicos, comerciales y de fabricación de los productos a cuya elaboración concurran directa o indirectamente, o de los cuales tengan conocimiento por razón del trabajo que desempeñen, así como de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa.'
];

$text = 'Artículo 134.- Son obligaciones de los trabajadores:';
$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
$pdf->Ln(2);

foreach ($obligaciones as $obligacion) {
    $pdf->Cell(10, 5, '', 0, 0); // Add left padding
    $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $obligacion));
}
 $pdf->Ln(2);
$text = 'Artículo 135.- Queda prohibido a los trabajadores:';
$pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
$prohibiciones = [
    'I. Ejecutar cualquier acto que pueda poner en peligro su propia seguridad, la de sus compañeros de trabajo o la de terceras personas, así como la de los establecimientos o lugares en que el trabajo se desempeñe;',
    'II. Faltar al trabajo sin causa justificada o sin permiso del patrón;',
    'III. Substraer de la empresa o establecimiento útiles de trabajo o materia prima o elaborada;',
    'IV. Presentarse al trabajo en estado de embriaguez;',
    'V. Presentarse al trabajo bajo la influencia de algún narcótico o droga enervante, salvo que exista prescripción médica. Antes de iniciar su servicio, el trabajador deberá poner el hecho en conocimiento del patrón y presentarle la prescripción suscrita por el médico;',
    'VI. Portar armas de cualquier clase durante las horas de trabajo, salvo que la naturaleza de éste lo exija. Se exceptúan de esta disposición las punzantes y punzo-cortantes que formen parte de las herramientas o útiles propios del trabajo;',
    'VII. Suspender las labores sin autorización del patrón;',
    'VIII. Hacer colectas en el establecimiento o lugar de trabajo;',
    'IX. Usar los útiles y herramientas suministrados por el patrón, para objeto distinto de aquél a que están destinados;',
    'X. Hacer cualquier clase de propaganda en las horas de trabajo, dentro del establecimiento;',
];

foreach ($prohibiciones as $prohibicion) {
    $pdf->Cell(10, 5, '', 0, 0); // Add left padding
    $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $prohibicion));
}
 $pdf->Ln(2);
 $text = 'DÉCIMA SEXTA. - "EL TRABAJADOR" deberá presentarse puntualmente a sus labores en el horario de trabajo establecido y deberá registrar su asistencia mediante su firma, huella dactilar, en los controles de entradas de salidas y/o listas de asistencia, o cualquier otro que se tenga implementado por parte de "EL PATRON" para tal fin. En caso de retraso o falta de asistencia injustificada, se sancionará con las medidas disciplinarias de contempladas en " LA LEY". Sin el menoscabo que bajo este supuesto implica una violación por parte de " EL TRABAJADOR" al presente instrumento y por ende "EL PATRON" queda en aptitud legal de rescindir el contrato de trabajo, o, no permitir la entrada al " TRABAJADOR" a sus labores, en aquellas ocasiones en que llegare retrasado a ellas.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA SÉPTIMA.- Así mismo "EL PATRÓN" podrá rescindir el contrato de trabajo sin responsabilidad de su parte, en el caso de que el "TRABAJADOR" incurra en alguna o varias de las causales de rescisión de la relación de trabajo que establece el artículo 47 de la Ley Federal del Trabajo, o cuando realice cualquier conducta que sea similar o análoga a las previstas por el citado numeral, o alguna causa especial de rescisión prevista en la Ley Federal del Trabajo, o en otros ordenamientos aplicables.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA OCTAVA. - "EL PATRON" podrá dispensar al "TRABAJADOR" de las causales señaladas en la cláusula anterior y no rescindir el contrato del mismo, siempre y cuando el " TRABAJADOR" repare el daño o bien cuando "EL PATRON" por convenir a sus intereses así lo determine.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'DÉCIMA NOVENA. - "El TRABAJADOR" reconoce que son propiedades del "PATRÓN" toda la información, documentos, herramientas e instrumentos de trabajo, manuales, y en general todos aquellos elementos materiales que se le asignen para la realización de sus labores, obligándose a conservarlos en buen estado y a entregarlos a " EL PATRÓN" cuando se termine la relación laboral, o cuando le sean requeridos.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'VIGÉSIMA.- Toda vez que "EL TRABAJADOR" tendrá acceso a datos e información en sus diversos formatos de "EL PATRON", las cuales de forma enunciativa más no limitativa se describen a continuación: información de carácter confidencial relativa a los servicios que presta "EL PATRON", información administrativa, contable, financiera a la que tenga acceso de manera directa o indirecta, información sobre cuentas bancarias de "EL PATRON", de clientes, proveedores, así como de los asuntos administrativos reservados, políticas de mercadotecnia, diseños gráficos, estrategias de mercado, listas de proveedores, cartera de clientes, estadísticas gráficas, sistemas de comercialización y distribución, estatutos y reglamentos, nombres y datos personales de empleados y directivos, bases de datos, contraseñas, software y herramientas, y en general toda clase de información propiedad de "EL PATRON", sus representantes, clientes, proveedores, y demás personas que guarden relación directa o indirecta; "EL TRABAJADOR" se obliga a guardar absoluto sigilo absteniéndose de divulgarla a terceros, en el entendido que de no cumplir con esta cláusula será motivo de rescisión del contrato, sin perjuicio de las sanciones legales civiles y penales que le resulten, debiendo reparar el daño que se ocasione por la divulgación.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'VIGÉSIMA PRIMERA. - En términos del artículo 25 fracción X y el artículo 501 de la Ley Federal de Trabajo, "EL TRABAJADOR" manifiesta que es su voluntad expresa nombrar como beneficiarios para que reciban el pago de los salarios y prestaciones devengadas y no cobradas en caso de enfermedad, accidente que lo incapacite parcial o definitivamente, muerte o desaparición derivada de un acto delincuencial; a las siguientes personas:';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'NOMBRE COMPLETO: '.$bene1.' PARENTESCO: '.$paren1.' PORCENTAJE: '.$porc1.'%';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 if(!empty($bene2)){
    $text = 'NOMBRE COMPLETO: '.$bene2.' PARENTESCO: '.$paren2.' PORCENTAJE: '.$porc2.'%';
    $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
    $pdf->Ln(2);
 }
 $text = 'VIGÉSIMA SEGUNDA. - "EL TRABAJADOR" se obliga a cumplir ampliamente con el Reglamento de la escuela, asistir puntualmente a su jornada laboral, así como cumplir con todas las disposiciones generales que en su momento se señalen.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'VIGÉSIMA TERCERA. - En caso de que exista daño económico, moral, o material por negligencia de las partes, podrán resolverlo en los Tribunales correspondientes a la materia de que se trate, sometiéndose expresamente a las Leyes y Tribunales de Tamaulipas, por lo que renuncian a cualquier fuero que por razón de su domicilio presente o futuro lleguen a tener o por el de la ubicación de la obra.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'VIGÉSIMA CUARTA. - Las partes reconocen que el presente instrumento deja sin efecto cualquier contrato anterior firmado entre las partes.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $text = 'VIGÉSIMA QUINTA. - Para todo lo no previsto en el contrato se estará a lo prescrito por de la Ley Federal de Trabajo, así como a lo dispuesto por el Reglamento Interior de Trabajo.';
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->Ln(2);
 $pdf->SetFont('Arial', 'B', 8);
 $text = "LEÍDO QUE FUE EL PRESENTE CONTRATO POR QUIENES EN EL INTERVIENEN LO RATIFICAN E IMPUESTOS DE SU CONTENIDO LO SUSCRIBEN POR TRIPLICADO EN LA CIUDAD MADERO, TAMAULIPAS. A LOS DÍAS $fecha_contrato_texto.";
 $pdf->MultiCell(0, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text));
 $pdf->SetFont('Arial', '', 8);
  // Calculamos la altura total que ocupará el bloque de firmas y testigos
  $altura_firmas = 20 // Espacio antes de las firmas
  + 5 // Línea de firma 1
  + 5 // Línea de firma 2
  + 2 // Espacio después de líneas de firma
  + 5 // Nombre representante
  + 5 // Nombre trabajador
  + 5 // Cargo representante
  + 5 // Cargo trabajador
  + 20 // Espacio antes de testigos
  + 5 // Línea de testigo 1
  + 5 // Línea de testigo 2
  + 2 // Espacio después de líneas de testigo
  + 5 // Nombre testigo 1
  + 5 // Nombre testigo 2
  + 5 // Texto "Testigo" 1
  + 5; // Texto "Testigo" 2

// Obtenemos la posición actual y el límite inferior de la hoja
$y_actual = $pdf->GetY();
$h_pagina = $pdf->h; // altura de la página en FPDF
$margen_inferior = 15; // margen inferior definido en SetAutoPageBreak
$espacio_restante = $h_pagina - $y_actual - $margen_inferior;

// Si no cabe, agregamos una nueva página
if ($altura_firmas > $espacio_restante) {
   $pdf->AddPage();
}

 $pdf->Ln(20);
 // Líneas para firmas
 $pdf->Cell(80, 5, '_______________________________________', 0, 0, 'C');
 $pdf->Cell(80, 5, '_______________________________________', 0, 1, 'C');
 $pdf->Ln(2);

 // Nombres bajo las líneas de firma
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'C. ANA MATILDE ÁVILA AZUARA'), 0, 0, 'C');
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'C. '.$nombre), 0, 1, 'C');

 // Cargos
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'INSTITUTO WINSTON CHURCHILL, A.C.'), 0, 0, 'C');
 $pdf->Cell(80, 5, 'TRABAJADOR', 0, 1, 'C');
 $pdf->Cell(80, 5, 'REPRESENTANTE LEGAL', 0, 1, 'C');

 $pdf->Ln(20);

 // Líneas para testigos
 $pdf->Cell(80, 5, '_______________________________________', 0, 0, 'C');
 $pdf->Cell(80, 5, '_______________________________________', 0, 1, 'C');
 $pdf->Ln(2);


 // Nombres de los testigos
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT','C. '.$testigo1), 0, 0, 'C');
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT','C. '.$testigo2), 0, 1, 'C');


 // Texto "Firma Testigo"
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Testigo'), 0, 0, 'C');
 $pdf->Cell(80, 5, iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Testigo'), 0, 1, 'C');

 // Crear la carpeta "contratos" si no existe
 $carpeta = 'pdf/';
 if (!is_dir($carpeta)) {
 mkdir($carpeta, 0777, true);
 }

 // Ruta donde se guardará el PDF
 $ruta_pdf = $carpeta . "contrato$id.pdf";

 // Guardar el PDF en el servidor
 $pdf->Output($ruta_pdf, 'F');

 // Redirigir a la descarga del archivo
 header("Location: $ruta_pdf");
 exit();
} else {
 echo "ID no proporcionado.";
}
?>
