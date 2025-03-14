//Calcular la antiguedad del auto
let inicio = true;
while (inicio) {
    const añoactual = 2025;
    let antiguedadAuto = parseInt(prompt('Ingrese el año de fabricacion del vehiculo. Por ej: 2021'));
    let antiguedad = calcularAntiguedad(antiguedadAuto, añoactual);

    if (antiguedad <= 5 && antiguedad >= 0) {
        alert(`El auto es nuevo y tiene ${antiguedad} años de Antiguedad`);
        break;
    } else if (antiguedad >= 5 && antiguedad <= 15) {
        alert(`El auto está en buen estado y tiene ${antiguedad} años de Antiguedad`);
        break;
    } else if (antiguedad >= 15 && antiguedad <= 25) {
        alert(`Requiere inspeccion ya que tiene ${antiguedad} años de Antiguedad`);
        break;
    } else if (antiguedad > 25 && antiguedad <= 60) {
        alert(`Tu automovil excede el limite requerido de antiguedad para contratar una cobertura. 
            El máximo permitido es hasta 25 años.
            - Antiguedad Automovil: ${antiguedad} años
            - Año ingresado:${antiguedadAuto}`
        );
        break;
    } else {
        alert('El año ingresado no es válido')
        break;
    }
}

function calcularAntiguedad(antiguedadAuto, añoactual) {
    return añoactual - antiguedadAuto;
}

//Array de regiones extendido de todas las zonas de BS AS (son varias, esta compactado)
const zonasBsas = [
    {
        zona: "AMBA (Conurbano Bonaerense)",
        localidades: ["Almirante Brown", "Avellaneda", "Berazategui", "Esteban Echeverría", "Ezeiza", "Florencio Varela",
            "General San Martín", "Hurlingham", "Ituzaingó", "José C. Paz", "Lanús", "La Matanza", "Lomas de Zamora", "Malvinas Argentinas",
            "Marcos Paz", "Merlo", "Moreno", "Morón", "Quilmes", "San Fernando", "San Isidro", "San Miguel", "Tres de Febrero", "Vicente López"
        ]
    },
    {
        zona: "CABA (Ciudad Autónoma de Buenos Aires)",
        localidades: ["Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores",
            "Floresta", "La Boca", "La Paternal", "Liniers", "Mataderos", "Monserrat", "Monte", "Castro", "Nueva Pompeya", "Núñez", "Palermo",
            "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero", "Recoleta", "Retiro", "Saavedra",
            "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sarsfield", "Versalles", "Villa Crespo", "Villa del Parque", "Villa Devoto",
            "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita",
            "Villa Soldati", "Villa Urquiza"]
    },
    {
        zona: "Litoral",
        localidades: ["San Nicolás", "San Pedro", "Zárate", "Campana", "Baradero", "Ramallo", "Salto", "Colón", "Rojas"]
    },
    {
        zona: "Norte",
        localidades: ["Escobar", "Pilar", "Tigre", "San Andrés de Giles", "Exaltación de la Cruz", "Capitán Sarmiento", "Arrecifes"]
    },
    {
        zona: "Oeste",
        localidades: ["General Rodríguez", "Luján", "Mercedes", "Navarro", "Suipacha", "Cañuelas", "General Las Heras"]
    },
    {
        zona: "Centro",
        localidades: ["Lobos", "Monte", "Roque Pérez", "Saladillo", "San Miguel del Monte", "Brandsen", "Chascomús", "General Paz", "Lezama"]
    },
    {
        zona: "Atlántica",
        localidades: ["La Plata", "Berisso", "Ensenada", "Dolores", "General Belgrano", "General Guido", "General Lavalle", "Tordillo",
            "Maipú", "Ayacucho", "General Madariaga", "Pinamar", "Villa Gesell", "Partido de la Costa", "Balcarce", "General Pueyrredón",
            "Lobería", "Mar Chiquita", "Necochea", "Miramar", "Mar del Plata"]
    },
    {
        zona: "Sur",
        localidades: ["Bahía Blanca", "Olavarría", "Tandil", "Azul", "Benito Juárez", "Coronel Suárez", "Tres Arroyos", "Coronel Pringles",
            "Pigüé", "Coronel Dorrego", "Monte Hermoso", "Sierra de la Ventana"]
    },
    {
        zona: "Noroeste",
        localidades: ["9 de Julio", "Alberti", "Bragado", "Carlos Casares", "Carlos Tejedor", "Chivilcoy", "Florentino Ameghino",
            "General Arenales", "General Pinto", "General Viamonte", "Junín", "Leandro N. Alem", "Lincoln", "Pehuajó", "Rivadavia",
            "Trenque Lauquen", "Daireaux", "Guaminí", "Puan", "Saavedra", "Tornquist", "Villarino", "Adolfo Alsina", "Adolfo Gonzales Chaves",
            "Coronel Rosales", "Patagones"]
    }
];
console.log(zonasBsas)

function buscarLocalidad(nombreLocalidad) {
    let normalizarLocalidad = nombreLocalidad.toLowerCase();  //formatea a minúscula los caracteres del prompt

    for (let i = 0; i < zonasBsas.length; i++) {
        if (zonasBsas[i].localidades.some(localidad => localidad.toLowerCase() === normalizarLocalidad)) {
            return {
                localidad: nombreLocalidad,
                zona: zonasBsas[i].zona
            };
        }
    }
    return "La localidad no fue encontrada o aún no fue habilitada. Intente con otra, por ejemplo: La Plata.";;
}

let nombreLocalidad = prompt("Introduzca el nombre de la localidad, por ejemplo: Tigre");

if (nombreLocalidad) {
    let resultadoLocalidad = buscarLocalidad(nombreLocalidad);
    if (typeof resultadoLocalidad === "string") {
        alert(resultadoLocalidad);
    } else {
        alert(`La localidad ${resultadoLocalidad.localidad} se encuentra en zona ${resultadoLocalidad.zona} y está habilitada!!`);
    }
} else {
    alert("Operacion cancelada por el usuario.");
}

function mostrarFechaHora() {
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString();
    document.getElementById("fechaHoraActual").textContent = fechaHora;
}
setInterval(mostrarFechaHora, 1000)
mostrarFechaHora()
