import { fechaATexto, fechaATextoMinusculas, numeroATextoPesos } from "@/lib/utils/formatters";
import type { ContratoData } from "./pdf-generator";

export type Paragraph = {
  text: string;
  bold?: boolean;
  align?: "left" | "center";
};

export type ContractTemplate = {
  titleLines: string[];
  paragraphs: Paragraph[];
  firmas: {
    patronNombre: string;
    patronEntidad: string;
    patronCargo: string;
    trabajadorNombre: string;
    trabajadorCargo: string;
  };
  testigos: {
    testigo1: string;
    testigo2: string;
  };
};

const PATRON_NOMBRE = "C. ANA MATILDE ÁVILA AZUARA";
const PATRON_ENTIDAD = "INSTITUTO WINSTON CHURCHILL, A.C.";
const PATRON_CARGO = "REPRESENTANTE LEGAL";
const TRABAJADOR_CARGO = "TRABAJADOR";

const formatMoney = (value: number): string => {
  const fixed = value.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${withCommas}.${decPart}`;
};

const splitFunciones = (funciones: string): string[] => {
  return funciones
    .split("-")
    .map((f) => f.trim())
    .filter(Boolean);
};

export function buildContratoDeterminadoTemplate(contrato: ContratoData): ContractTemplate {
  const salario = contrato.sueldo_mensual || 0;
  const salarioTexto = numeroATextoPesos(salario);
  const salarioFormato = formatMoney(salario);
  const funcionesList = splitFunciones(contrato.funciones);
  const horario = `${contrato.hora_entrada} - ${contrato.hora_salida}`;

  const paragraphs: Paragraph[] = [
    {
      text:
        `CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO DETERMINADO, que celebran por una parte ` +
        `${PATRON_ENTIDAD} representada en este acto por la C. ${PATRON_NOMBRE} ` +
        `en su calidad de Representante Legal en lo sucesivo "EL PATRON" y por la otra el C. ` +
        `${contrato.nombre}, a quien en lo sucesivo se le denominará "EL TRABAJADOR", ` +
        `quienes están conformes en sujetarse al tenor de los siguientes DECLARACIONES Y CLAUSULAS:`,
    },
    { text: "DECLARACIONES", bold: true, align: "center" },
    { text: 'I) "EL PATRON" INSTITUTO WINSTON CHURCHILL, A.C. declara a través de su representante:' },
    {
      text:
        "1.- Ser una persona moral legalmente constituida bajo la Ley General de Sociedades Mercantiles con el " +
        "Instrumento Público número nueve mil cuatrocientos veintidós, Volumen doscientos cuarenta, de fecha " +
        "veintitrés de julio de mil novecientos noventa y nueve, ante la fe del LIC. FRANCISCO HACES " +
        "ARGUELLES, titular de la Notaría Pública Número 38, con ejercicio en el Segundo Distrito Judicial del " +
        "Estado, que comprende los municipios de Tampico, Ciudad Madero y Altamira, e inscrita debidamente en " +
        "el Registro Público del Comercio en Tampico, Tamaulipas con domicilio fiscal en calle 3 número 309, " +
        "colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas y legalmente representada por la C. Ing. " +
        "Ana Matilde Ávila Azuara, que cuenta con facultades suficientes para celebrar el presente convenio, " +
        "acreditando su personalidad en términos del documento ya mencionado, facultades que a la fecha no le han " +
        "sido revocadas o modificadas en forma alguna.",
    },
    {
      text:
        "2.- Que tiene como objeto social principalmente la enseñanza, con autorización o con reconocimiento de " +
        "validez oficial de estudios en los términos de la Ley General de Educación.",
    },
    {
      text: `3.- Que requiere contratar de los servicios del TRABAJADOR para que se desempeñe en el puesto de ${contrato.puesto}.`,
    },
    { text: 'II) "EL TRABAJADOR", por sus propios derechos manifiesta:' },
    {
      text:
        `1.- Bajo protesta de decir verdad, llamarse C. ${contrato.nombre}, ser de nacionalidad mexicana, ` +
        `tener ${contrato.edad} años de edad, estado civil ${contrato.e_civil}, con RFC ${contrato.rfc}, ` +
        `domicilio en ${contrato.domicilio}, con CURP ${contrato.curp}.`,
    },
    {
      text:
        "2.- Manifiesta que tiene la capacidad y aptitudes para desarrollarse en el puesto referido en la " +
        "declaración I inciso 3.",
    },
    {
      text:
        '3.- "EL TRABAJADOR" está conforme en desempeñar los requerimientos de la empresa y en plasmar en el ' +
        "presente proemio las condiciones generales de trabajo sobre las cuales prestará sus servicios personales.",
    },
    { text: 'III) "AMBAS PARTES" acuerdan:' },
    {
      text:
        '1.- Se reconocen mutuamente como "TRABAJADOR" Y "PATRÓN", Por lo que desde este momento "EL TRABAJADOR " ' +
        'acepta que "EL PATRON " es su única fuente de empleo, así como "EL PATRON " reconoce a "EL TRABAJADOR " ' +
        "como su empleado y sus responsabilidades legales para con él.",
    },
    {
      text:
        "Bajo protesta de decir verdad ambas partes manifiestan que son verídicos todos los datos que se plasman " +
        "en presente ocurso, así como, que es su libre voluntad sujetarse al contenido de las siguientes:",
    },
    { text: "CLAUSULAS", bold: true, align: "center" },
    {
      text:
        'PRIMERA. - En lo consecuente dentro de este proemio, a la Ley Federal del Trabajo se le conocerá como ' +
        '"LA LEY"; al referirse al presente documento como "EL CONTRATO", y a los que lo suscriben como "LAS PARTES".',
    },
    {
      text:
        'SEGUNDA. - "EL CONTRATO" se celebra por TIEMPO DETERMINADO sujeto a capacitación inicial según lo ' +
        'establece el artículo 35 de "LA LEY". La vigencia de la relación de trabajo tendrá una duración de 90 días, ' +
        "el cual computará a partir de la fecha de la firma del presente contrato hasta el " +
        `${contrato.fecha_termino} , sujetándose a una evaluación al cumplir los primeros 30 días laborando, ` +
        'donde de no acreditar competencia el trabajador, a juicio de "EL PATRON", se dará por terminada la relación ' +
        'de trabajo, sin responsabilidad para el patrón. En el supuesto que la fuente de trabajo se agote o se ' +
        'extinga previo al término establecido se hace del conocimiento a "EL TRABAJADOR" que la relación ' +
        "contractual quedará extinta ante la inexistencia de la fuente de trabajo.",
    },
    {
      text:
        "El presente contrato obliga a lo expresamente pactado conforme a las disposiciones contenidas en el " +
        "artículo 195 de la Ley Federal del Trabajo, y la duración del mismo será la señalada en el párrafo anterior, " +
        "por lo que al concluir dicho término las partes contratantes lo darán por terminado, sin responsabilidad " +
        "alguna para ambas partes.",
    },
    {
      text:
        "Asimismo, convienen los contratantes que, si vencido el término fijado en la cláusula segunda subsiste la " +
        "materia de trabajo, este instrumento se prorrogará única y exclusivamente por el tiempo que dure dicha " +
        "circunstancia sin necesidad de celebrar uno nuevo, y al agotarse ésta, terminará también la relación " +
        "laboral, en términos del artículo 39 de la Ley Federal del Trabajo.",
    },
    {
      text:
        'TERCERA. - "EL TRABAJADOR" tendrá como domicilio fijo de su fuente de trabajo, para la prestación de los ' +
        "servicios, el ubicado en calle 3 número 309, colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas;\n" +
        '"LAS PARTES" acuerdan que dicho domicilio podrá ser modificado de acuerdo a las necesidades de "EL PATRON", ' +
        'previo aviso por escrito a "EL TRABAJADOR". Para el caso que en el nuevo lugar de prestación de servicios ' +
        'que le fuera lasignado variara el horario de labores, "EL TRABAJADOR" acepta allanarse a dicha modalidad.',
    },
    {
      text:
        'CUARTA. - "EL TRABAJADOR" se desempeñará en el puesto de ' +
        `${contrato.puesto}, y sus funciones consistirán, de manera enunciativa, más no limitativa en:`,
    },
    ...funcionesList.map((funcion) => ({ text: `- ${funcion}` })),
    {
      text:
        'QUINTA. - "EL TRABAJADOR" se obliga desempeñar los trabajos descritos en la cláusula que antecede, así como ' +
        "cualquier actividad conexa a su ocupación principal siempre que se trate del trabajo contratado, así mismo " +
        "de acuerdo a las necesidades del Instituto se podrán realizar cambios de áreas y roles establecidos, " +
        'cumpliendo para tal efecto con las instrucciones que reciba de "EL PATRON" o representantes facultados para ello.',
    },
    {
      text:
        'SEXTA. - "EL PATRON y "EL TRABAJADOR" convienen en los términos del artículo 59 de la Ley Federal de Trabajo ' +
        "que la duración de la jornada de trabajo será de 48 horas semanales, dividiéndose de lunes a sábado entre " +
        `las ${horario} horas, dispondrá de tiempo para consumir sus alimentos, con descanso fijo el día domingo de ` +
        "cada semana, así como días de descanso obligatorio que establece la Ley Federal de Trabajo con goce de sueldo.",
    },
    {
      text:
        'SÉPTIMA. - "EL TRABAJADOR", por razón de su puesto, únicamente podrá laborar tiempo extraordinario cuando ' +
        '"EL PATRÓN" se lo indique y mediante orden por escrito, la que señalará el día o los días y el horario en el ' +
        'cual se desempeñará el mismo. Para el caso de computar el tiempo extraordinario laborado deberá ' +
        '"EL TRABAJADOR " recabar y conservar la orden referida a fin de que en su momento quede debidamente pagado el ' +
        'tiempo extra laborado; la falta de presentación de esa orden sólo es imputable al "TRABAJADOR". ' +
        '"AMBAS PARTES" manifiestan que salvo esta forma queda prohibido en el centro de trabajo pagar horas extras.',
    },
    {
      text:
        'OCTAVA. - "EL TRABAJADOR" percibirá por la prestación de sus servicios como salario mensual la cantidad de ' +
        `${salarioFormato} (${salarioTexto}), cantidad que incluye un porcentaje en vales de despensa determinado por ` +
        "políticas de la empresa. Dicho salario será cubierto a mes vencido mediante 2-dos quincenas los días 15 y 30 " +
        "de cada mes, estando incluido en su salario quincenal el pago de los séptimos días y días festivos y/o descanso " +
        "obligatorio. El pago se hará dentro de su jornada de trabajo o inmediatamente después a la conclusión de la " +
        "misma en el en el lugar de la prestación de sus servicios, sin perjuicio de que el pago se haga en los términos " +
        "estipulados en el párrafo siguiente:",
    },
    {
      text:
        "El salario se pagará en efectivo o por medio de depósito y/o transferencia en cuenta bancaria, tarjeta de " +
        'débito, o cualquier otro medio electrónico, otorgando "EL TRABAJADOR" su consentimiento para que se le pague ' +
        "su salario por esos medios en la cuenta bancaria que para tal efecto deberá de proporcionar por escrito a " +
        '"EL PATRON", lo anterior con fundamento en el artículo 101 de la Ley Federal del Trabajo.',
    },
    {
      text:
        'Ambas partes convienen que "EL PATRON" hará por cuenta de "EL TRABAJADOR" las deducciones legales correspondientes, ' +
        "particularmente las que se refieren a Impuesto sobre la Renta, Seguro Social, pago de créditos otorgados por " +
        "INFONAVIT, INFONACOT y demás deducciones que resulten de las leyes respectivas y sus reglamentos. Asimismo, " +
        'el "TRABAJADOR" otorga su consentimiento para que de su salario se hagan las deducciones en caso de deudas por ' +
        "anticipo de salarios, pagos hechos en exceso, préstamos, y en general en cualquiera de los casos que señalan " +
        "los artículos 97 y 110 de la Ley, cuyas deducciones se harán en la proporción y con las limitantes que señalan " +
        "dichos preceptos.",
    },
    {
      text:
        'Las partes convienen que "EL TRABAJADOR" deberá firmar recibos impresos por la totalidad de los salarios ordinarios, ' +
        "extraordinarios y demás prestaciones que perciba, no obstante, los recibos impresos podrán ser sustituidos por " +
        "recibos de pago contenidos en comprobantes fiscales digitales por Internet (CFDI), manifestando " +
        '"EL TRABAJADOR" su conformidad al respecto.',
    },
    {
      text:
        'NOVENA. - "EL TRABAJADOR" tendrá derecho por cada seis días de labores a descansar uno con el pago de salario diario correspondiente. ' +
        'Quedan establecidos como días de descanso obligatorio los señalados en el artículo 74 de "LA LEY ".',
    },
    {
      text:
        'DÉCIMA. - "EL TRABAJADOR" tendrá derecho a disfrutar de un periodo de vacaciones según lo establecido en el artículo 199 de la Ley Federal de Trabajo.',
    },
    {
      text:
        'DÉCIMA PRIMERA. - "EL TRABAJADOR" tendrá derecho a recibir por parte de "EL PATRON", antes del día 20 de diciembre de cada año el importe correspondiente ' +
        "a quince días de salario como pago del aguinaldo a que se refiere el artículo 87 de la Ley Federal de Trabajo, o su parte proporcional al tiempo " +
        "laborado en caso de que este sea menor a un año.",
    },
    {
      text:
        'DÉCIMA SEGUNDA. - "EL TRABAJADOR" será capacitado o adiestrado en los términos de los planes y programas establecidos (o que se establezcan), por "EL PATRÓN", ' +
        "conforme a lo dispuesto en el Capítulo III Bis, Titulo Cuarto de la Ley Federal del Trabajo.",
    },
    {
      text:
        'DÉCIMA TERCERA. - "EL TRABAJADOR" acepta someterse a los exámenes médicos que periódicamente establezca "EL PATRON" en los términos del artículo 134 Fracción X de "LA LEY", ' +
        "a fin de mantener en forma óptima sus facultades físicas e intelectuales, para el mejor desempeño de sus funciones. El médico que practique los reconocimientos será designado y retribuido por la " +
        '"EL PATRON".',
    },
    {
      text:
        'DÉCIMA CUARTA. - "EL TRABAJADOR" deberá observar y cumplir las disposiciones contenidas en el Reglamento Interior de Trabajo con sus respectivas modificaciones que se encuentra establecido, mismo ' +
        "que en este acto de le da a conocer, firmando de leído y conforme, obligándose a cumplirlo en todas y cada una de sus partes.",
    },
    {
      text:
        'DÉCIMA QUINTA. - "EL TRABAJADOR" se obliga a observar todas las disposiciones y medidas de seguridad e higiene respectivas, así como en su caso a formar parte de las comisiones mixtas que sean necesarias, ' +
        "y participar en los cursos que se impartan sobre esta materia.",
    },
    {
      text:
        '"EL TRABAJADOR " acepta y se obliga a cumplir todo lo contenido los artículos 134 y 135 de " LA LEY " y que corresponde a las obligaciones y prohibiciones de los trabajadores en el desempeño de sus labores al servicio de " ELPATRON ", ' +
        "el cual literalmente se transcribe a continuación:",
    },
    { text: "Artículo 134.- Son obligaciones de los trabajadores:" },
    { text: "I.- Cumplir las disposiciones de las normas de trabajo que les sean aplicables;" },
    {
      text:
        "II.- Observar las disposiciones contenidas en el reglamento y las normas oficiales mexicanas en materia de seguridad, salud y medio ambiente de trabajo, así como las que indiquen los patrones para su seguridad y protección personal;",
    },
    {
      text:
        "III.- Desempeñar el servicio bajo la dirección del patrón o de su representante, a cuya autoridad estarán subordinados en todo lo concerniente al trabajo;",
    },
    { text: "IV.- Ejecutar el trabajo con la intensidad, cuidado y esmero apropiados y en la forma, tiempo y lugar convenidos;" },
    { text: "V.- Dar aviso inmediato al patrón, salvo caso fortuito o de fuerza mayor, de las causas justificadas que le impidan concurrir a su trabajo;" },
    {
      text:
        "VI.- Restituir al patrón los materiales no usados y conservar en buen estado los instrumentos y útiles que les haya dado para el trabajo, no siendo responsables por el deterioro que origine el uso de estos objetos, ni del ocasionado por caso fortuito, fuerza mayor, o por mala calidad o defectuosa construcción;",
    },
    { text: "VII.- Observar buenas costumbres durante el servicio;" },
    { text: "VIII.- Prestar auxilios en cualquier tiempo que se necesiten, cuando por siniestro o riesgo inminente peligren las personas o los intereses del patrón o de sus compañeros de trabajo;" },
    { text: "IX.- Integrar los organismos que establece esta Ley;" },
    {
      text:
        "X.- Someterse a los reconocimientos médicos previstos en el reglamento interior y demás normas vigentes en la empresa o establecimiento, para comprobar que no padecen alguna incapacidad o enfermedad de trabajo, contagiosa o incurable;",
    },
    { text: "XI.- Poner en conocimiento del patrón las enfermedades contagiosas que padezcan, tan pronto como tengan conocimiento de las mismas;" },
    {
      text:
        "XII.- Comunicar al patrón o a su representante las deficiencias que adviertan, a fin de evitar daños o perjuicios a los intereses y vidas de sus compañeros de trabajo o de los patrones;",
    },
    {
      text:
        "XIII.- Guardar escrupulosamente los secretos técnicos, comerciales y de fabricación de los productos a cuya elaboración concurran directa o indirectamente, o de los cuales tengan conocimiento por razón del trabajo que desempeñen, así como de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa.",
    },
    { text: "Artículo 135.- Queda prohibido a los trabajadores:" },
    {
      text:
        "I. Ejecutar cualquier acto que pueda poner en peligro su propia seguridad, la de sus compañeros de trabajo o la de terceras personas, así como la de los establecimientos o lugares en que el trabajo se desempeñe;",
    },
    { text: "II. Faltar al trabajo sin causa justificada o sin permiso del patrón;" },
    { text: "III. Substraer de la empresa o establecimiento útiles de trabajo o materia prima o elaborada;" },
    { text: "IV. Presentarse al trabajo en estado de embriaguez;" },
    {
      text:
        "V. Presentarse al trabajo bajo la influencia de algún narcótico o droga enervante, salvo que exista prescripción médica. Antes de iniciar su servicio, el trabajador deberá poner el hecho en conocimiento del patrón y presentarle la prescripción suscrita por el médico;",
    },
    {
      text:
        "VI. Portar armas de cualquier clase durante las horas de trabajo, salvo que la naturaleza de éste lo exija. Se exceptúan de esta disposición las punzantes y punzo-cortantes que formen parte de las herramientas o útiles propios del trabajo;",
    },
    { text: "VII. Suspender las labores sin autorización del patrón;" },
    { text: "VIII. Hacer colectas en el establecimiento o lugar de trabajo;" },
    { text: "IX. Usar los útiles y herramientas suministrados por el patrón, para objeto distinto de aquél a que están destinados;" },
    { text: "X. Hacer cualquier clase de propaganda en las horas de trabajo, dentro del establecimiento;" },
    { text: "XI. Acosar sexualmente a cualquier persona o realizar actos inmorales en los lugares de trabajo." },
    {
      text:
        'DÉCIMA SEXTA. - "EL TRABAJADOR" deberá presentarse puntualmente a sus labores en el horario de trabajo establecido y deberá registrar su asistencia mediante su firma, huella dactilar, en los controles de entradas de salidas y/o listas de asistencia, o cualquier otro que se tenga implementado por parte de "EL PATRON" para tal fin. En caso de retraso o falta de asistencia injustificada, se sancionará con las medidas disciplinarias de contempladas en " LA LEY". Sin el menoscabo que bajo este supuesto implica una violación por parte de " EL TRABAJADOR" al presente instrumento y por ende "EL PATRON" queda en aptitud legal de rescindir el contrato de trabajo, o, no permitir la entrada al " TRABAJADOR" a sus labores, en aquellas ocasiones en que llegare retrasado a ellas.',
    },
    {
      text:
        'DÉCIMA SÉPTIMA.- Así mismo "EL PATRÓN" podrá rescindir el contrato de trabajo sin responsabilidad de su parte, en el caso de que el "TRABAJADOR" incurra en alguna o varias de las causales de rescisión de la relación de trabajo que establece el artículo 47 de la Ley Federal del Trabajo, o cuando realice cualquier conducta que sea similar o análoga a las previstas por el citado numeral, o alguna causa especial de rescisión prevista en la Ley Federal del Trabajo, o en otros ordenamientos aplicables.',
    },
    {
      text:
        'DÉCIMA OCTAVA. - "EL PATRON" podrá dispensar al "TRABAJADOR" de las causales señaladas en la cláusula anterior y no rescindir el contrato del mismo, siempre y cuando el " TRABAJADOR" repare el daño o bien cuando "EL PATRON" por convenir a sus intereses así lo determine.',
    },
    {
      text:
        'DÉCIMA NOVENA. - "El TRABAJADOR" reconoce que son propiedades del "PATRÓN" toda la información, documentos, herramientas e instrumentos de trabajo, manuales, y en general todos aquellos elementos materiales que se le asignen para la realización de sus labores, obligándose a conservarlos en buen estado y a entregarlos a " EL PATRÓN" cuando se termine la relación laboral, o cuando le sean requeridos.',
    },
    {
      text:
        'VIGÉSIMA.- Toda vez que "EL TRABAJADOR" tendrá acceso a datos e información en sus diversos formatos de "EL PATRON", las cuales de forma enunciativa más no limitativa se describen a continuación: información de carácter confidencial relativa a los servicios que presta "EL PATRON", información administrativa, contable, financiera a la que tenga acceso de manera directa o indirecta, información sobre cuentas bancarias de "EL PATRON", de clientes, proveedores, así como de los asuntos administrativos reservados, políticas de mercadotecnia, diseños gráficos, estrategias de mercado, listas de proveedores, cartera de clientes, estadísticas gráficas, sistemas de comercialización y distribución, estatutos y reglamentos, nombres y datos personales de empleados y directivos, bases de datos, contraseñas, software y herramientas, y en general toda clase de información propiedad de "EL PATRON", sus representantes, clientes, proveedores, y demás personas que guarden relación directa o indirecta; "EL TRABAJADOR" se obliga a guardar absoluto sigilo absteniéndose de divulgarla a terceros, en el entendido que de no cumplir con esta cláusula será motivo de rescisión del contrato, sin perjuicio de las sanciones legales civiles y penales que le resulten, debiendo reparar el daño que se ocasione por la divulgación.',
    },
    {
      text:
        "VIGÉSIMA PRIMERA. - En términos del artículo 25 fracción X y el artículo 501 de la Ley Federal de Trabajo, " +
        '"EL TRABAJADOR" manifiesta que es su voluntad expresa nombrar como beneficiarios para que reciban el pago de ' +
        "los salarios y prestaciones devengadas y no cobradas en caso de enfermedad, accidente que lo incapacite parcial o " +
        "definitivamente, muerte o desaparición derivada de un acto delincuencial; a las siguientes personas:",
    },
    { text: `NOMBRE COMPLETO: ${contrato.bene1} PARENTESCO: ${contrato.paren1} PORCENTAJE: ${contrato.porc1}%` },
  ];

  if (contrato.bene2) {
    paragraphs.push({
      text: `NOMBRE COMPLETO: ${contrato.bene2} PARENTESCO: ${contrato.paren2} PORCENTAJE: ${contrato.porc2}%`,
    });
  }

  paragraphs.push(
    {
      text:
        'VIGÉSIMA SEGUNDA. - "EL TRABAJADOR" se obliga a cumplir ampliamente con el Reglamento de la escuela, asistir puntualmente a su jornada laboral, así como cumplir con todas las disposiciones generales que en su momento se señalen.',
    },
    {
      text:
        "VIGÉSIMA TERCERA. - En caso de que exista daño económico, moral, o material por negligencia de las partes, podrán " +
        "resolverlo en los Tribunales correspondientes a la materia de que se trate, sometiéndose expresamente a las Leyes " +
        "y Tribunales de Tamaulipas, por lo que renuncian a cualquier fuero que por razón de su domicilio presente o futuro " +
        "lleguen a tener o por el de la ubicación de la obra.",
    },
    {
      text:
        "VIGÉSIMA CUARTA. - Las partes reconocen que el presente instrumento deja sin efecto cualquier contrato anterior firmado entre las partes.",
    },
    {
      text:
        "VIGÉSIMA QUINTA. - Para todo lo no previsto en el contrato se estará a lo prescrito por de la Ley Federal de Trabajo, así como a lo dispuesto por el Reglamento Interior de Trabajo.",
    },
    {
      text:
        `LEÍDO QUE FUE EL PRESENTE CONTRATO POR QUIENES EN EL INTERVIENEN LO RATIFICAN E IMPUESTOS DE SU CONTENIDO LO SUSCRIBEN POR TRIPLICADO EN LA CIUDAD MADERO, TAMAULIPAS. A LOS DÍAS ${fechaATexto(
          contrato.fecha_contrato || ""
        )}.`,
      bold: true,
    }
  );

  return {
    titleLines: ["CONTRATO INDIVIDUAL DE TRABAJO"],
    paragraphs,
    firmas: {
      patronNombre: PATRON_NOMBRE,
      patronEntidad: PATRON_ENTIDAD,
      patronCargo: PATRON_CARGO,
      trabajadorNombre: `C. ${contrato.nombre}`,
      trabajadorCargo: TRABAJADOR_CARGO,
    },
    testigos: {
      testigo1: `C. ${contrato.testigo1}`,
      testigo2: `C. ${contrato.testigo2}`,
    },
  };
}

export function buildContratoIndeterminadoTemplate(contrato: ContratoData): ContractTemplate {
  const salario = contrato.salario || 0;
  const salarioTexto = numeroATextoPesos(salario);
  const salarioFormato = formatMoney(salario);
  const funcionesList = splitFunciones(contrato.funciones);
  const horario = `${contrato.hora_entrada} - ${contrato.hora_salida}`;
  const fechaLeidoTexto = fechaATexto(contrato.fecha_leido || "").toUpperCase();

  const paragraphs: Paragraph[] = [
    {
      text:
        `CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO INDETERMINADO, que celebran por una parte ` +
        `${PATRON_ENTIDAD} representada en este acto por la C. ${PATRON_NOMBRE} ` +
        `en su calidad de Representante Legal en lo sucesivo "EL PATRON" y por la otra el C. ` +
        `${contrato.nombre}, a quien en lo sucesivo se le denominará "EL TRABAJADOR", ` +
        `quienes están conformes en sujetarse al tenor de los siguientes DECLARACIONES Y CLAUSULAS:`,
    },
    { text: "DECLARACIONES", bold: true, align: "center" },
    { text: '"EL PATRON" INSTITUTO WINSTON CHURCHILL, A.C. declara a través de su representante:' },
    {
      text:
        "1.- Ser una persona moral legalmente constituida bajo la Ley General de Sociedades Mercantiles con el " +
        "Instrumento Público número nueve mil cuatrocientos veintidós, Volumen doscientos cuarenta, de fecha " +
        "veintitrés de julio de mil novecientos noventa y nueve, ante la fe del LIC. FRANCISCO HACES " +
        "ARGUELLES, titular de la Notaría Pública Número 38, con ejercicio en el Segundo Distrito Judicial del " +
        "Estado, que comprende los municipios de Tampico, Ciudad Madero y Altamira, e inscrita debidamente en " +
        "el Registro Público del Comercio en Tampico, Tamaulipas con domicilio fiscal en calle 3 número 309, " +
        "colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas y legalmente representada por la C. Ing. " +
        "Ana Matilde Ávila Azuara, que cuenta con facultades suficientes para celebrar el presente convenio, " +
        "acreditando su personalidad en términos del documento ya mencionado, facultades que a la fecha no le han " +
        "sido revocadas o modificadas en forma alguna.",
    },
    {
      text:
        "2.- Que tiene como objeto social principalmente la enseñanza, con autorización o con reconocimiento de " +
        "validez oficial de estudios en los términos de la Ley General de Educación.",
    },
    {
      text: `3.- Que requiere contratar de los servicios del TRABAJADOR para que se desempeñe en el puesto de ${contrato.puesto}.`,
    },
    { text: '"EL TRABAJADOR", por sus propios derechos manifiesta:' },
    {
      text:
        `1.- Bajo protesta de decir verdad, llamarse C. ${contrato.nombre}, ser de nacionalidad mexicana, tener ` +
        `${contrato.edad} años de edad, estado civil ${contrato.e_civil}, con RFC ${contrato.rfc},domicilio en ` +
        `${contrato.domicilio}, con CURP ${contrato.curp}.`,
    },
    {
      text:
        "2.- Manifiesta que tiene la capacidad y aptitudes para desarrollarse en el puesto referido en la declaración I inciso 3.",
    },
    {
      text:
        '"EL TRABAJADOR" está conforme en desempeñar los requerimientos de la empresa y en plasmar en el presente proemio las condiciones generales de trabajo sobre las cuales prestará sus servicios personales.',
    },
    { text: '"AMBAS PARTES" acuerdan:' },
    {
      text:
        '1.- Se reconocen mutuamente como "TRABAJADOR" Y "PATRÓN", Por lo que desde este momento "EL TRABAJADOR " acepta que "EL PATRON " es su única fuente de empleo, así como "EL PATRON " reconoce a "EL TRABAJADOR " como su empleado y sus responsabilidades legales para con él.',
    },
    {
      text:
        "Bajo protesta de decir verdad ambas partes manifiestan que son verídicos todos los datos que se plasman en presente ocurso, así como, que es su libre voluntad sujetarse al contenido de las siguientes: ",
    },
    { text: "CLAUSULAS", bold: true, align: "center" },
    {
      text:
        'PRIMERA. - En lo consecuente dentro de este proemio, a la Ley Federal del Trabajo se le conocerá como "LA LEY"; al referirse al presente documento como "EL CONTRATO", y a los que lo suscriben como "LAS PARTES".',
    },
    {
      text:
        'SEGUNDA. - "EL CONTRATO" se celebra por TIEMPO INDETERMINADO según lo establece el artículo 35 de "LA LEY". En el supuesto que la fuente de trabajo se agote o se extinga previo al término establecido se hace del conocimiento a "EL TRABAJADOR" que la relación contractual quedara extinta ante la inexistencia de la fuente de trabajo.',
    },
    {
      text:
        '"EL TRABAJADOR" tendrá como domicilio fijo de su fuente de trabajo, para la prestación de los servicios, el ubicado en calle 3 número 309, colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas;\n"LAS PARTES" acuerdan que dicho domicilio podrá ser modificado de acuerdo a las necesidades de "EL PATRON", previo aviso por escrito a "EL TRABAJADOR". Para el caso que en el nuevo lugar de prestación de servicios que le fuera lasignado variara el horario de labores, "EL TRABAJADOR" acepta allanarse a dicha modalidad.',
    },
    {
      text:
        'CUARTA. - "EL TRABAJADOR" se desempeñará en el puesto de ' +
        `${contrato.puesto}, y sus funciones consistirán, de manera enunciativa, más no limitativa en:`,
    },
    ...funcionesList.map((funcion) => ({ text: `- ${funcion}` })),
    {
      text:
        'QUINTA. - "EL TRABAJADOR" se obliga desempeñar los trabajos descritos en la cláusula que antecede, así como cualquier actividad conexa a su ocupación principal siempre que se trate del trabajo contratado, así mismo de acuerdo a las necesidades del Instituto se podrán realizar cambios de áreas y roles establecidos, cumpliendo para tal efecto con las instrucciones que reciba de "EL PATRON" o representantes facultados para ello.',
    },
    {
      text:
        'SEXTA. - "EL PATRON y "EL TRABAJADOR" convienen en los términos del artículo 59 de la Ley Federal de Trabajo que la duración de la jornada de trabajo será de 48 horas semanales, dividiéndose de lunes a sábado entre las ' +
        `${horario} horas, dispondrá de tiempo para consumir sus alimentos, con descanso fijo el día domingo de cada semana, así como días de descanso obligatorio que establece la Ley Federal de Trabajo con goce de sueldo.`,
    },
    {
      text:
        'SÉPTIMA. - "EL TRABAJADOR", por razón de su puesto, únicamente podrá laborar tiempo extraordinario cuando "EL PATRÓN" se lo indique y mediante orden por escrito, la que señalará el día o los días y el horario en el cual se desempeñará el mismo. Para el caso de computar el tiempo extraordinario laborado deberá "EL TRABAJADOR " recabar y conservar la orden referida a fin de que en su momento quede debidamente pagado el tiempo extra laborado; la falta de presentación de esa orden sólo es imputable al "TRABAJADOR". "AMBAS PARTES" manifiestan que salvo esta forma queda prohibido en el centro de trabajo pagar horas extras.',
    },
    {
      text: `OCTAVA. - "EL TRABAJADOR" percibirá por la prestación de sus servicios como salario mensual la cantidad de ${salarioFormato} (${salarioTexto}), cantidad que incluye un porcentaje en vales de despensa determinado por políticas de la empresa. Dicho salario será cubierto a mes vencido mediante 2-dos quincenas los días 15 y 30 de cada mes, estando incluido en su salario quincenal el pago de los séptimos días y días festivos y/o descanso obligatorio. El pago se hará dentro de su jornada de trabajo o inmediatamente después a la conclusión de la misma en el en el lugar de la prestación de sus servicios, sin perjuicio de que el pago se haga en los términos estipulados en el párrafo siguiente:`,
    },
    {
      text:
        'El salario se pagará en efectivo o por medio de depósito y/o transferencia en cuenta bancaria, tarjeta de débito, o cualquier otro medio electrónico, otorgando "EL TRABAJADOR" su consentimiento para que se le pague su salario por esos medios en la cuenta bancaria que para tal efecto deberá de proporcionar por escrito a "EL PATRON", lo anterior con fundamento en el artículo 101 de la Ley Federal del Trabajo.',
    },
    {
      text:
        'Ambas partes convienen que "EL PATRON" hará por cuenta de "EL TRABAJADOR" las deducciones legales correspondientes, particularmente las que se refieren a Impuesto sobre la Renta, Seguro Social, pago de créditos otorgados por INFONAVIT, INFONACOT y demás deducciones que resulten de las leyes respectivas y sus reglamentos. Asimismo, el "TRABAJADOR" otorga su consentimiento para que de su salario se hagan las deducciones en caso de deudas por anticipo de salarios, pagos hechos en exceso, préstamos, y en general en cualquiera de los casos que señalan los artículos 97 y 110 de la Ley, cuyas deducciones se harán en la proporción y con las limitantes que señalan dichos preceptos.',
    },
    {
      text:
        'Las partes convienen que "EL TRABAJADOR" deberá firmar recibos impresos por la totalidad de los salarios ordinarios, extraordinarios y demás prestaciones que perciba, no obstante, los recibos impresos podrán ser sustituidos por recibos de pago contenidos en comprobantes fiscales digitales por Internet (CFDI), manifestando "EL TRABAJADOR" su conformidad al respecto.',
    },
    {
      text:
        'NOVENA. - "EL TRABAJADOR" tendrá derecho por cada seis días de labores a descansar uno con el pago de salario diario correspondiente. Quedan establecidos como días de descanso obligatorio los señalados en el artículo 74 de "LA LEY ".',
    },
    {
      text:
        'DÉCIMA. - "EL TRABAJADOR" tendrá derecho a disfrutar de un periodo de vacaciones según lo establecido en el artículo 199 de la Ley Federal de Trabajo.',
    },
    {
      text:
        'DÉCIMA PRIMERA. - "EL TRABAJADOR" tendrá derecho a recibir por parte de "EL PATRON", antes del día 20 de diciembre de cada año el importe correspondiente a quince días de salario como pago del aguinaldo a que se refiere el artículo 87 de la Ley Federal de Trabajo, o su parte proporcional al tiempo laborado en caso de que este sea menor a un año.',
    },
    {
      text:
        'DÉCIMA SEGUNDA. - "EL TRABAJADOR" será capacitado o adiestrado en los términos de los planes y programas establecidos (o que se establezcan), por "EL PATRÓN", conforme a lo dispuesto en el Capítulo III Bis, Titulo Cuarto de la Ley Federal del Trabajo.',
    },
    {
      text:
        'DÉCIMA TERCERA. - "EL TRABAJADOR" acepta someterse a los exámenes médicos que periódicamente establezca "EL PATRON" en los términos del artículo 134 Fracción X de "LA LEY", a fin de mantener en forma óptima sus facultades físicas e intelectuales, para el mejor desempeño de sus funciones. El médico que practique los reconocimientos será designado y retribuido por la "EL PATRON".',
    },
    {
      text:
        'DÉCIMA CUARTA. - "EL TRABAJADOR" deberá observar y cumplir las disposiciones contenidas en el Reglamento Interior de Trabajo con sus respectivas modificaciones que se encuentra establecido, mismo que en este acto de le da a conocer, firmando de leído y conforme, obligándose a cumplirlo en todas y cada una de sus partes.',
    },
    {
      text:
        'DÉCIMA QUINTA. - "EL TRABAJADOR" se obliga a observar todas las disposiciones y medidas de seguridad e higiene respectivas, así como en su caso a formar parte de las comisiones mixtas que sean necesarias, y participar en los cursos que se impartan sobre esta materia.',
    },
    {
      text:
        '"EL TRABAJADOR " acepta y se obliga a cumplir todo lo contenido los artículos 134 y 135 de " LA LEY " y que corresponde a las obligaciones y prohibiciones de los trabajadores en el desempeño de sus labores al servicio de " ELPATRON ", el cual literalmente se transcribe a continuación:',
    },
    { text: "Artículo 134.- Son obligaciones de los trabajadores:" },
    { text: "I.- Cumplir las disposiciones de las normas de trabajo que les sean aplicables;" },
    {
      text:
        "II.- Observar las disposiciones contenidas en el reglamento y las normas oficiales mexicanas en materia de seguridad, salud y medio ambiente de trabajo, así como las que indiquen los patrones para su seguridad y protección personal;",
    },
    {
      text:
        "III.- Desempeñar el servicio bajo la dirección del patrón o de su representante, a cuya autoridad estarán subordinados en todo lo concerniente al trabajo;",
    },
    { text: "IV.- Ejecutar el trabajo con la intensidad, cuidado y esmero apropiados y en la forma, tiempo y lugar convenidos;" },
    { text: "V.- Dar aviso inmediato al patrón, salvo caso fortuito o de fuerza mayor, de las causas justificadas que le impidan concurrir a su trabajo;" },
    {
      text:
        "VI.- Restituir al patrón los materiales no usados y conservar en buen estado los instrumentos y útiles que les haya dado para el trabajo, no siendo responsables por el deterioro que origine el uso de estos objetos, ni del ocasionado por caso fortuito, fuerza mayor, o por mala calidad o defectuosa construcción;",
    },
    { text: "VII.- Observar buenas costumbres durante el servicio;" },
    { text: "VIII.- Prestar auxilios en cualquier tiempo que se necesiten, cuando por siniestro o riesgo inminente peligren las personas o los intereses del patrón o de sus compañeros de trabajo;" },
    { text: "IX.- Integrar los organismos que establece esta Ley;" },
    {
      text:
        "X.- Someterse a los reconocimientos médicos previstos en el reglamento interior y demás normas vigentes en la empresa o establecimiento, para comprobar que no padecen alguna incapacidad o enfermedad de trabajo, contagiosa o incurable;",
    },
    { text: "XI.- Poner en conocimiento del patrón las enfermedades contagiosas que padezcan, tan pronto como tengan conocimiento de las mismas;" },
    {
      text:
        "XII.- Comunicar al patrón o a su representante las deficiencias que adviertan, a fin de evitar daños o perjuicios a los intereses y vidas de sus compañeros de trabajo o de los patrones;",
    },
    {
      text:
        "XIII.- Guardar escrupulosamente los secretos técnicos, comerciales y de fabricación de los productos a cuya elaboración concurran directa o indirectamente, o de los cuales tengan conocimiento por razón del trabajo que desempeñen, así como de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa.",
    },
    { text: "Artículo 135.- Queda prohibido a los trabajadores:" },
    {
      text:
        "I. Ejecutar cualquier acto que pueda poner en peligro su propia seguridad, la de sus compañeros de trabajo o la de terceras personas, así como la de los establecimientos o lugares en que el trabajo se desempeñe;",
    },
    { text: "II. Faltar al trabajo sin causa justificada o sin permiso del patrón;" },
    { text: "III. Substraer de la empresa o establecimiento útiles de trabajo o materia prima o elaborada;" },
    { text: "IV. Presentarse al trabajo en estado de embriaguez;" },
    {
      text:
        "V. Presentarse al trabajo bajo la influencia de algún narcótico o droga enervante, salvo que exista prescripción médica. Antes de iniciar su servicio, el trabajador deberá poner el hecho en conocimiento del patrón y presentarle la prescripción suscrita por el médico;",
    },
    {
      text:
        "VI. Portar armas de cualquier clase durante las horas de trabajo, salvo que la naturaleza de éste lo exija. Se exceptúan de esta disposición las punzantes y punzo-cortantes que formen parte de las herramientas o útiles propios del trabajo;",
    },
    { text: "VII. Suspender las labores sin autorización del patrón;" },
    { text: "VIII. Hacer colectas en el establecimiento o lugar de trabajo;" },
    { text: "IX. Usar los útiles y herramientas suministrados por el patrón, para objeto distinto de aquél a que están destinados;" },
    { text: "X. Hacer cualquier clase de propaganda en las horas de trabajo, dentro del establecimiento;" },
    { text: "XI. Acosar sexualmente a cualquier persona o realizar actos inmorales en los lugares de trabajo." },
    {
      text:
        'DÉCIMA SEPTIMA. - "EL TRABAJADOR" deberá presentarse puntualmente a sus labores en el horario de trabajo establecido y deberá registrar su asistencia mediante su firma, huella dactilar, en los controles de entradas de salidas y/o listas de asistencia, o cualquier otro que se tenga implementado por parte de "EL PATRON" para tal fin. En caso de retraso o falta de asistencia injustificada, se sancionará con las medidas disciplinarias de contempladas en " LA LEY". Sin el menoscabo que bajo este supuesto implica una violación por parte de " EL TRABAJADOR" al presente instrumento y por ende "EL PATRON" queda en aptitud legal de rescindir el contrato de trabajo, o, no permitir la entrada al " TRABAJADOR" a sus labores, en aquellas ocasiones en que llegare retrasado a ellas.',
    },
    {
      text:
        'DÉCIMA OCTAVA. - "LAS PARTES" reconocen como fecha de antigüedad o de iniciación de prestación de servicios de "EL TRABAJADOR" a partir del día ' +
        `${contrato.fecha_inicio}.`,
    },
    {
      text:
        'DÉCIMA NOVENA.- Así mismo "EL PATRÓN" podrá rescindir el contrato de trabajo sin responsabilidad de su parte, en el caso de que el "TRABAJADOR" incurra en alguna o varias de las causales de rescisión de la relación de trabajo que establece el artículo 47 de la Ley Federal del Trabajo, o cuando realice cualquier conducta que sea similar o análoga a las previstas por el citado numeral, o alguna causa especial de rescisión prevista en la Ley Federal del Trabajo, o en otros ordenamientos aplicables.',
    },
    {
      text:
        'VIGÉSIMA. - "EL PATRON" podrá dispensar al "TRABAJADOR" de las causales señaladas en la cláusula anterior y no rescindir el contrato del mismo, siempre y cuando el "TRABAJADOR" repare el daño o bien cuando "EL PATRON" por convenir a sus intereses así lo determine.',
    },
    {
      text:
        'VIGÉSIMA PRIMERA. - "El TRABAJADOR" reconoce que son propiedades del "PATRÓN" toda la información, documentos, herramientas e instrumentos de trabajo, manuales, y en general todos aquellos elementos materiales que se le asignen para la realización de sus labores, obligándose a conservarlos en buen estado y a entregarlos a " EL PATRÓN" cuando se termine la relación laboral, o cuando le sean requeridos.',
    },
    {
      text:
        'VIGÉSIMA SEGUNDA.- Toda vez que "EL TRABAJADOR" tendrá acceso a datos e información en sus diversos formatos de "EL PATRON", las cuales de forma enunciativa más no limitativa se describen a continuación: información de carácter confidencial relativa a los servicios que presta "EL PATRON", información administrativa, contable, financiera a la que tenga acceso de manera directa o indirecta, información sobre cuentas bancarias de "EL PATRON", de clientes, proveedores, así como de los asuntos administrativos reservados, políticas de mercadotecnia, diseños gráficos, estrategias de mercado, listas de proveedores, cartera de clientes, estadísticas gráficas, sistemas de comercialización y distribución, estatutos y reglamentos, nombres y datos personales de empleados y directivos, bases de datos, contraseñas, software y herramientas, y en general toda clase de información propiedad de "EL PATRON", sus representantes, clientes, proveedores, y demás personas que guarden relación directa o indirecta; "EL TRABAJADOR" se obliga a guardar absoluto sigilo absteniéndose de divulgarla a terceros, en el entendido que de no cumplir con esta cláusula será motivo de rescisión del contrato, sin perjuicio de las sanciones legales civiles y penales que le resulten, debiendo reparar el daño que se ocasione por la divulgación.',
    },
    {
      text:
        "VIGÉSIMA TERCERA. - En términos del artículo 25 fracción X y el artículo 501 de la Ley Federal de Trabajo, " +
        '"EL TRABAJADOR" manifiesta que es su voluntad expresa nombrar como beneficiarios para que reciban el pago de ' +
        "los salarios y prestaciones devengadas y no cobradas en caso de enfermedad, accidente que lo incapacite parcial o " +
        "definitivamente, muerte o desaparición derivada de un acto delincuencial; a las siguientes personas:",
    },
    { text: `NOMBRE COMPLETO: ${contrato.bene1} PARENTESCO: ${contrato.paren1} PORCENTAJE: ${contrato.porc1}%` },
  ];

  if (contrato.bene2) {
    paragraphs.push({
      text: `NOMBRE COMPLETO: ${contrato.bene2} PARENTESCO: ${contrato.paren2} PORCENTAJE: ${contrato.porc2}%`,
    });
  }

  paragraphs.push(
    {
      text:
        'VIGÉSIMA CUARTA. - "EL TRABAJADOR" se obliga a cumplir ampliamente con el Reglamento de la escuela, asistir puntualmente a su jornada laboral, así como cumplir con todas las disposiciones generales que en su momento se señalen.',
    },
    {
      text:
        "VIGÉSIMA QUINTA. - En caso de que exista daño económico, moral, o material por negligencia de las partes, podrán resolverlo en los Tribunales correspondientes a la materia de que se trate, sometiéndose expresamente a las Leyes y Tribunales de Tamaulipas, por lo que renuncian a cualquier fuero que por razón de su domicilio presente o futuro lleguen a tener o por el de la ubicación de la obra.",
    },
    {
      text:
        "VIGÉSIMA SEXTA. - Las partes reconocen que el presente instrumento deja sin efecto cualquier contrato anterior firmado entre las partes.",
    },
    {
      text:
        "VIGÉSIMA SEPTIMA. - Para todo lo no previsto en el contrato se estará a lo prescrito por de la Ley Federal de Trabajo, así como a lo dispuesto por el Reglamento Interior de Trabajo.",
    },
    {
      text:
        `LEÍDO QUE FUE EL PRESENTE CONTRATO POR QUIENES EN EL INTERVIENEN LO RATIFICAN E IMPUESTOS DE SU CONTENIDO LO SUSCRIBEN POR TRIPLICADO EN LA CIUDAD MADERO, TAMAULIPAS. A LOS DÍAS ${fechaLeidoTexto}.`,
      bold: true,
    }
  );

  return {
    titleLines: ["CONTRATO INDIVIDUAL DE TRABAJO"],
    paragraphs,
    firmas: {
      patronNombre: PATRON_NOMBRE,
      patronEntidad: PATRON_ENTIDAD,
      patronCargo: PATRON_CARGO,
      trabajadorNombre: `C. ${contrato.nombre}`,
      trabajadorCargo: TRABAJADOR_CARGO,
    },
    testigos: {
      testigo1: `C. ${contrato.testigo1}`,
      testigo2: `C. ${contrato.testigo2}`,
    },
  };
}

export function buildContratoHoraTemplate(contrato: ContratoData): ContractTemplate {
  const salario = contrato.costo_hora || 0;
  const salarioTexto = numeroATextoPesos(salario);
  const salarioFormato = formatMoney(salario);
  const funcionesList = splitFunciones(contrato.funciones);
  const horario = `${contrato.hora_entrada} - ${contrato.hora_salida}`;
  const fechaIni = fechaATextoMinusculas(contrato.fecha_inicio_esc || "");
  const fechaTer = fechaATextoMinusculas(contrato.fecha_termino_esc || "");
  const fechaContratoTexto = fechaATexto(contrato.fecha_contrato || "");

  const paragraphs: Paragraph[] = [
    {
      text:
        "CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO DETERMINADO CON JORNADA REDUCIDA, que celebran por una parte el " +
        `${PATRON_ENTIDAD}, representada en este acto por la C. ${PATRON_NOMBRE} en su calidad de Representante Legal en lo ` +
        'sucesivo "EL PATRON" y por la otra el C. ' +
        `${contrato.nombre}, a quien en lo sucesivo se le denominará "EL TRABAJADOR", quienes están conformes en ` +
        "sujetarse al tenor de los siguientes DECLARACIONES Y CLAUSULAS:",
    },
    { text: "DECLARACIONES", bold: true, align: "center" },
    { text: 'I) "EL PATRON" INSTITUTO WINSTON CHURCHILL, A.C. declara a través de su representante:' },
    {
      text:
        "1.- Ser una persona moral legalmente constituida bajo la Ley General de Sociedades Mercantiles con el " +
        "Instrumento Público número nueve mil cuatrocientos veintidós, Volumen doscientos cuarenta, de fecha " +
        "veintitrés de julio de mil novecientos noventa y nueve, ante la fe del LIC. FRANCISCO HACES " +
        "ARGUELLES, titular de la Notaría Pública Número 38, con ejercicio en el Segundo Distrito Judicial del " +
        "Estado, que comprende los municipios de Tampico, Ciudad Madero y Altamira, e inscrita debidamente en " +
        "el Registro Público del Comercio en Tampico, Tamaulipas con domicilio fiscal en calle 3 número 309, " +
        "colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas y legalmente representada por la C. Ing. " +
        "Ana Matilde Ávila Azuara, que cuenta con facultades suficientes para celebrar el presente convenio, " +
        "acreditando su personalidad en términos del documento ya mencionado, facultades que a la fecha no le han " +
        "sido revocadas o modificadas en forma alguna.",
    },
    {
      text:
        "2.- Que tiene como objeto social principalmente la enseñanza, con autorización o con reconocimiento de " +
        "validez oficial de estudios en los términos de la Ley General de Educación.",
    },
    {
      text: `3.- Que requiere contratar de los servicios del TRABAJADOR para que se desempeñe en el puesto de ${contrato.puesto}.`,
    },
    { text: 'II) "EL TRABAJADOR", por sus propios derechos manifiesta:' },
    {
      text:
        `1.- Bajo protesta de decir verdad, llamarse C. ${contrato.nombre}, ser de nacionalidad mexicana, tener ${contrato.edad} años de edad, estado civil ${contrato.e_civil}, con RFC ${contrato.rfc},domicilio en ${contrato.domicilio}, con CURP ${contrato.curp}.`,
    },
    {
      text:
        "2.- Manifiesta que tiene la capacidad y aptitudes para desarrollarse en el puesto referido en la declaración I inciso 3.",
    },
    {
      text:
        '3.- "EL TRABAJADOR" está conforme en desempeñar los requerimientos de la empresa y en plasmar en el presente proemio las condiciones generales de trabajo sobre las cuales prestará sus servicios personales.',
    },
    { text: 'III) "AMBAS PARTES" acuerdan:' },
    {
      text:
        '1.- Se reconocen mutuamente como "TRABAJADOR" Y "PATRÓN", Por lo que desde este momento "EL TRABAJADOR " acepta que "EL PATRON " es su única fuente de empleo, así como "EL PATRON " reconoce a "EL TRABAJADOR " como su empleado y sus responsabilidades legales para con él.',
    },
    {
      text:
        "Bajo protesta de decir verdad ambas partes manifiestan que son verídicos todos los datos que se plasman en presente ocurso, así como, que es su libre voluntad sujetarse al contenido de las siguientes:",
    },
    { text: "CLAUSULAS", bold: true, align: "center" },
    {
      text:
        'PRIMERA. - En lo consecuente dentro de este proemio, a la Ley Federal del Trabajo se le conocerá como "LA LEY"; al referirse al presente documento como "EL CONTRATO", y a los que lo suscriben como "LAS PARTES".',
    },
    {
      text:
        `SEGUNDA. - "EL CONTRATO" se celebra por TIEMPO DETERMINADO correspondiente al ciclo escolar 2025 - 2026 del ${fechaIni} al ${fechaTer}, sujetándose a una evaluación al cumplir los primeros 30 días laborando, donde de no acreditar competencia el trabajador, a juicio de "EL PATRON", se dará por terminada la relación de trabajo, sin responsabilidad para el patrón. En el supuesto que la fuente de trabajo se agote o se extinga previo al término establecido se hace del conocimiento a "EL TRABAJADOR" que la relación contractual quedara extinta ante la inexistencia de la fuente de trabajo.`,
    },
    {
      text:
        "El presente contrato obliga a lo expresamente pactado conforme a las disposiciones contenidas en el artículo 195 de la Ley Federal del Trabajo, y la duración del mismo será la señalada en el párrafo anterior, por lo que al concluir dicho término las partes contratantes lo darán por terminado, sin responsabilidad alguna para ambas partes.",
    },
    {
      text:
        "Asimismo, convienen los contratantes que, si vencido el término fijado en la cláusula segunda subsiste la materia de trabajo, este instrumento se prorrogará única y exclusivamente por el tiempo que dure dicha circunstancia sin necesidad de celebrar uno nuevo, y al agotarse ésta, terminará también la relación laboral, en términos del artículo 39 de la Ley Federal del Trabajo.",
    },
    {
      text:
        'TERCERA. - "EL TRABAJADOR" tendrá como domicilio fijo de su fuente de trabajo, para la prestación de los servicios, el ubicado en (dirección del centro de trabajo);\n"LAS PARTES" acuerdan que dicho domicilio podrá ser modificado de acuerdo a las necesidades de "EL PATRON", previo aviso por escrito a "EL TRABAJADOR". Para el caso que en el nuevo lugar de prestación de servicios que le fuera lasignado variara el horario de labores, "EL TRABAJADOR" acepta allanarse a dicha modalidad.',
    },
    {
      text:
        'CUARTA. - "EL TRABAJADOR" se desempeñará en el puesto de ' +
        `${contrato.puesto}, y sus funciones consistirán, de manera enunciativa, más no limitativa en:`,
    },
    ...funcionesList.map((funcion) => ({ text: `- ${funcion}` })),
    {
      text:
        'QUINTA. - "EL TRABAJADOR" se obliga desempeñar los trabajos descritos en la cláusula que antecede, así como cualquier actividad conexa a su ocupación principal siempre que se trate del trabajo contratado, así mismo de acuerdo a las necesidades del Instituto se podrán realizar cambios de áreas y roles establecidos, cumpliendo para tal efecto con las instrucciones que reciba de "EL PATRON" o representantes facultados para ello.',
    },
    {
      text:
        'SEXTA.- "EL PATRÓN" y "EL TRABAJADOR" convienen, conforme al artículo 59 de la Ley Federal del Trabajo, que el horario de labores será los días: ' +
        `${contrato.dias}, distribuyéndose las horas de trabajo dentro del periodo comprendido entre las ${horario} horas, ` +
        "conforme a las necesidades del instituto, quien podrá modificar la distribución de dichas horas previo aviso al trabajador.",
    },
    {
      text:
        'SÉPTIMA. - "EL TRABAJADOR", por razón de su puesto, únicamente podrá laborar tiempo extraordinario cuando "EL PATRÓN" se lo indique y mediante orden por escrito, la que señalará el día o los días y el horario en el cual se desempeñará el mismo. Para el caso de computar el tiempo extraordinario laborado deberá "EL TRABAJADOR " recabar y conservar la orden referida a fin de que en su momento quede debidamente pagado el tiempo extra laborado; la falta de presentación de esa orden sólo es imputable al "TRABAJADOR". "AMBAS PARTES" manifiestan que salvo esta forma queda prohibido en el centro de trabajo pagar horas extras.',
    },
    {
      text:
        `OCTAVA. - "EL TRABAJADOR" percibirá por la prestación de sus servicios la cantidad de $${salarioFormato} (${salarioTexto}), por hora. Los cuáles serán cubiertos por quincenas vencidas los días 15 y 30 de cada mes en moneda nacional del año corriente. El pago se hará dentro de su jornada de trabajo o inmediatamente después a la conclusión de la misma en el en el lugar de la prestación de sus servicios, sin perjuicio de que el pago se haga en los términos estipulados en el párrafo siguiente:`,
    },
    {
      text:
        'El salario se pagará en efectivo, otorgando "EL TRABAJADOR" su consentimiento para que se le pague su salario por esos medios, lo anterior con fundamento en el artículo 101 de la Ley Federal del Trabajo.',
    },
    {
      text:
        'NOVENA. - "EL TRABAJADOR" será capacitado o adiestrado en los términos de los planes y programas establecidos (o que se establezcan), por "EL PATRÓN", conforme a lo dispuesto en el Capítulo III Bis, Titulo Cuarto de la Ley Federal del Trabajo.',
    },
    {
      text:
        'DÉCIMA. - "EL TRABAJADOR" acepta someterse a los exámenes médicos que periódicamente establezca "EL PATRON" en los términos del artículo 134 Fracción X de "LA LEY", a fin de mantener en forma óptima sus facultades físicas e intelectuales, para el mejor desempeño de sus funciones. El médico que practique los reconocimientos será designado y retribuido por la "EL PATRON".',
    },
    {
      text:
        'DÉCIMA PRIMERA. - "EL TRABAJADOR" deberá observar y cumplir las disposiciones contenidas en el Reglamento Interior de Trabajo con sus respectivas modificaciones que se encuentra establecido, mismo que en este acto de le da a conocer, firmando de leído y conforme, obligándose a cumplirlo en todas y cada una de sus partes.',
    },
    {
      text:
        'DÉCIMA SEGUNDA. - "EL TRABAJADOR" se obliga a observar todas las disposiciones y medidas de seguridad e higiene respectivas, así como en su caso a formar parte de las comisiones mixtas que sean necesarias, y participar en los cursos que se impartan sobre esta materia.',
    },
    {
      text:
        'DÉCIMA TERCERA. - "EL TRABAJADOR " acepta y se obliga a cumplir todo lo contenido los artículos 134 y 135 de " LA LEY " y que corresponde a las obligaciones y prohibiciones de los trabajadores en el desempeño de sus labores al servicio de " ELPATRON ", el cual literalmente se transcribe a continuación:',
    },
    { text: "Artículo 134.- Son obligaciones de los trabajadores:" },
    { text: "I.- Cumplir las disposiciones de las normas de trabajo que les sean aplicables;" },
    {
      text:
        "II.- Observar las disposiciones contenidas en el reglamento y las normas oficiales mexicanas en materia de seguridad, salud y medio ambiente de trabajo, así como las que indiquen los patrones para su seguridad y protección personal;",
    },
    {
      text:
        "III.- Desempeñar el servicio bajo la dirección del patrón o de su representante, a cuya autoridad estarán subordinados en todo lo concerniente al trabajo;",
    },
    { text: "IV.- Ejecutar el trabajo con la intensidad, cuidado y esmero apropiados y en la forma, tiempo y lugar convenidos;" },
    { text: "V.- Dar aviso inmediato al patrón, salvo caso fortuito o de fuerza mayor, de las causas justificadas que le impidan concurrir a su trabajo;" },
    {
      text:
        "VI.- Restituir al patrón los materiales no usados y conservar en buen estado los instrumentos y útiles que les haya dado para el trabajo, no siendo responsables por el deterioro que origine el uso de estos objetos, ni del ocasionado por caso fortuito, fuerza mayor, o por mala calidad o defectuosa construcción;",
    },
    { text: "VII.- Observar buenas costumbres durante el servicio;" },
    { text: "VIII.- Prestar auxilios en cualquier tiempo que se necesiten, cuando por siniestro o riesgo inminente peligren las personas o los intereses del patrón o de sus compañeros de trabajo;" },
    { text: "IX.- Integrar los organismos que establece esta Ley;" },
    {
      text:
        "X.- Someterse a los reconocimientos médicos previstos en el reglamento interior y demás normas vigentes en la empresa o establecimiento, para comprobar que no padecen alguna incapacidad o enfermedad de trabajo, contagiosa o incurable;",
    },
    { text: "XI.- Poner en conocimiento del patrón las enfermedades contagiosas que padezcan, tan pronto como tengan conocimiento de las mismas;" },
    {
      text:
        "XII.- Comunicar al patrón o a su representante las deficiencias que adviertan, a fin de evitar daños o perjuicios a los intereses y vidas de sus compañeros de trabajo o de los patrones;",
    },
    {
      text:
        "XIII.- Guardar escrupulosamente los secretos técnicos, comerciales y de fabricación de los productos a cuya elaboración concurran directa o indirectamente, o de los cuales tengan conocimiento por razón del trabajo que desempeñen, así como de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa.",
    },
    { text: "Artículo 135.- Queda prohibido a los trabajadores:" },
    {
      text:
        "I. Ejecutar cualquier acto que pueda poner en peligro su propia seguridad, la de sus compañeros de trabajo o la de terceras personas, así como la de los establecimientos o lugares en que el trabajo se desempeñe;",
    },
    { text: "II. Faltar al trabajo sin causa justificada o sin permiso del patrón;" },
    { text: "III. Substraer de la empresa o establecimiento útiles de trabajo o materia prima o elaborada;" },
    { text: "IV. Presentarse al trabajo en estado de embriaguez;" },
    {
      text:
        "V. Presentarse al trabajo bajo la influencia de algún narcótico o droga enervante, salvo que exista prescripción médica. Antes de iniciar su servicio, el trabajador deberá poner el hecho en conocimiento del patrón y presentarle la prescripción suscrita por el médico;",
    },
    {
      text:
        "VI. Portar armas de cualquier clase durante las horas de trabajo, salvo que la naturaleza de éste lo exija. Se exceptúan de esta disposición las punzantes y punzo-cortantes que formen parte de las herramientas o útiles propios del trabajo;",
    },
    { text: "VII. Suspender las labores sin autorización del patrón;" },
    { text: "VIII. Hacer colectas en el establecimiento o lugar de trabajo;" },
    { text: "IX. Usar los útiles y herramientas suministrados por el patrón, para objeto distinto de aquél a que están destinados;" },
    { text: "X. Hacer cualquier clase de propaganda en las horas de trabajo, dentro del establecimiento;" },
    { text: "XI. Acosar sexualmente a cualquier persona o realizar actos inmorales en los lugares de trabajo." },
    {
      text:
        'DÉCIMA CUARTA. - "EL TRABAJADOR" deberá presentarse puntualmente a sus labores en el horario de trabajo establecido y deberá registrar su asistencia mediante su firma, huella dactilar, en los controles de entradas de salidas y/o listas de asistencia, o cualquier otro que se tenga implementado por parte de "EL PATRON" para tal fin. En caso de retraso o falta de asistencia injustificada, se sancionará con las medidas disciplinarias de contempladas en " LA LEY". Sin el menoscabo que bajo este supuesto implica una violación por parte de " EL TRABAJADOR" al presente instrumento y por ende "EL PATRON" queda en aptitud legal de rescindir el contrato de trabajo, o, no permitir la entrada al " TRABAJADOR" a sus labores, en aquellas ocasiones en que llegare retrasado a ellas.',
    },
    {
      text:
        'DÉCIMA QUINTA.- Así mismo "EL PATRÓN" podrá rescindir el contrato de trabajo sin responsabilidad de su parte, en el caso de que el "TRABAJADOR" incurra en alguna o varias de las causales de rescisión de la relación de trabajo que establece el artículo 47 de la Ley Federal del Trabajo, o cuando realice cualquier conducta que sea similar o análoga a las previstas por el citado numeral, o alguna causa especial de rescisión prevista en la Ley Federal del Trabajo, o en otros ordenamientos aplicables.',
    },
    {
      text:
        'DÉCIMA SEXTA. - "EL PATRON" podrá dispensar al "TRABAJADOR" de las causales señaladas en la cláusula anterior y no rescindir el contrato del mismo, siempre y cuando el " TRABAJADOR" repare el daño o bien cuando "EL PATRON" por convenir a sus intereses así lo determine.',
    },
    {
      text:
        'DÉCIMA SEPTIMA. - "El TRABAJADOR" reconoce que son propiedades del "PATRÓN" toda la información, documentos, herramientas e instrumentos de trabajo, manuales, y en general todos aquellos elementos materiales que se le asignen para la realización de sus labores, obligándose a conservarlos en buen estado y a entregarlos a " EL PATRÓN" cuando se termine la relación laboral, o cuando le sean requeridos.',
    },
    {
      text:
        'DECIMA OCTAVA.- Toda vez que "EL TRABAJADOR" tendrá acceso a datos e información en sus diversos formatos de "EL PATRON", las cuales de forma enunciativa más no limitativa se describen a continuación: información de carácter confidencial relativa a los servicios que presta "EL PATRON", información administrativa, contable, financiera a la que tenga acceso de manera directa o indirecta, información sobre cuentas bancarias de "EL PATRON", de clientes, proveedores, así como de los asuntos administrativos reservados, políticas de mercadotecnia, diseños gráficos, estrategias de mercado, listas de proveedores, cartera de clientes, estadísticas gráficas, sistemas de comercialización y distribución, estatutos y reglamentos, nombres y datos personales de empleados y directivos, bases de datos, contraseñas, software y herramientas, y en general toda clase de información propiedad de "EL PATRON", sus representantes, clientes, proveedores, y demás personas que guarden relación directa o indirecta; "EL TRABAJADOR" se obliga a guardar absoluto sigilo absteniéndose de divulgarla a terceros, en el entendido que de no cumplir con esta cláusula será motivo de rescisión del contrato, sin perjuicio de las sanciones legales civiles y penales que le resulten, debiendo reparar el daño que se ocasione por la divulgación.',
    },
    {
      text:
        'DECIMA NOVENA. - En términos del artículo 25 fracción X y el artículo 501 de la Ley Federal de Trabajo, "EL TRABAJADOR" manifiesta que es su voluntad expresa nombrar como beneficiarios para que reciban el pago de los salarios y prestaciones devengadas y no cobradas en caso de enfermedad, accidente que lo incapacite parcial o definitivamente, muerte o desaparición derivada de un acto delincuencial; a las siguientes personas:',
    },
    { text: `NOMBRE COMPLETO: ${contrato.bene1} PARENTESCO: ${contrato.paren1} PORCENTAJE: ${contrato.porc1}%` },
  ];

  if (contrato.bene2) {
    paragraphs.push({
      text: `NOMBRE COMPLETO: ${contrato.bene2} PARENTESCO: ${contrato.paren2} PORCENTAJE: ${contrato.porc2}%`,
    });
  }

  paragraphs.push(
    {
      text:
        'VIGÉSIMA . - "EL TRABAJADOR" se obliga a cumplir ampliamente con el Reglamento de la escuela, asistir puntualmente a su jornada laboral, así como cumplir con todas las disposiciones generales que en su momento se señalen.',
    },
    {
      text:
        "VIGÉSIMA PRIMERA. - En caso de que exista daño económico, moral, o material por negligencia de las partes, podrán resolverlo en los Tribunales correspondientes a la materia de que se trate, sometiéndose expresamente a las Leyes y Tribunales de Tamaulipas, por lo que renuncian a cualquier fuero que por razón de su domicilio presente o futuro lleguen a tener o por el de la ubicación de la obra.",
    },
    {
      text:
        "VIGÉSIMA SEGUNDA. - Las partes reconocen que el presente instrumento deja sin efecto cualquier contrato anterior firmado entre las partes.",
    },
    {
      text:
        "VIGÉSIMA TERCERA. - Para todo lo no previsto en el contrato se estará a lo prescrito por de la Ley Federal de Trabajo, así como a lo dispuesto por el Reglamento Interior de Trabajo.",
    },
    {
      text:
        `LEÍDO QUE FUE EL PRESENTE CONTRATO POR QUIENES EN EL INTERVIENEN LO RATIFICAN E IMPUESTOS DE SU CONTENIDO LO SUSCRIBEN POR TRIPLICADO EN LA CIUDAD MADERO, TAMAULIPAS. A LOS DÍAS ${fechaContratoTexto}.`,
      bold: true,
    }
  );

  return {
    titleLines: ["CONTRATO INDIVIDUAL DE TRABAJO"],
    paragraphs,
    firmas: {
      patronNombre: PATRON_NOMBRE,
      patronEntidad: PATRON_ENTIDAD,
      patronCargo: PATRON_CARGO,
      trabajadorNombre: `C. ${contrato.nombre}`,
      trabajadorCargo: TRABAJADOR_CARGO,
    },
    testigos: {
      testigo1: `C. ${contrato.testigo1}`,
      testigo2: `C. ${contrato.testigo2}`,
    },
  };
}
