//Array de regiones extendido de todas las zonas de BS AS
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
//Selector de temas
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const languageSelect = document.getElementById('language-select');
    const body = document.body;
    const htmlElement = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    const storedLanguage = localStorage.getItem('language');

    // Función para aplicar el tema
    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
        localStorage.setItem('theme', theme);
    }

    // Función para aplicar el lenguaje
    function setLanguage(lang) {
        htmlElement.lang = lang; // Establecer el atributo lang del html
        localStorage.setItem('language', lang);
        console.log(`Idioma aplicado: ${lang}`);
    }

    // Establece el tema guardado al cargar la página
    if (storedTheme) {
        setTheme(storedTheme);
    } else {
        setTheme('light'); // Establecer tema claro por defecto
    }

    // Establece el lenguaje guardado al cargar la página
    if (storedLanguage) {
        languageSelect.value = storedLanguage;
        setLanguage(storedLanguage); // Aplicar el lenguaje guardado
    } else {
        setLanguage('es'); // Establecer idioma español por defecto
    }

    // Evento para cambiar el tema
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Evento para cambiar el lenguaje
    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        setLanguage(selectedLanguage);
    });
});





















// function buscarLocalidad(nombreLocalidad) {
//     let normalizarLocalidad = nombreLocalidad.toLowerCase();  //formatea a minúscula los caracteres del prompt

//     for (let i = 0; i < zonasBsas.length; i++) {
//         if (zonasBsas[i].localidades.some(localidad => localidad.toLowerCase() === normalizarLocalidad)) {
//             return {
//                 localidad: nombreLocalidad,
//                 zona: zonasBsas[i].zona
//             };
//         }
//     }
//     return "La localidad no fue encontrada o aún no fue habilitada. Intente con otra, por ejemplo: La Plata.";;
// }

// let nombreLocalidad = prompt("Introduzca el nombre de la localidad, por ejemplo: Tigre");

// if (nombreLocalidad) {
//     let resultadoLocalidad = buscarLocalidad(nombreLocalidad);
//     if (typeof resultadoLocalidad === "string") {
//         alert(resultadoLocalidad);
//     } else {
//         alert(`La localidad ${resultadoLocalidad.localidad} se encuentra en zona ${resultadoLocalidad.zona} y está habilitada!!`);
//     }
// } else {
//     alert("Operacion cancelada por el usuario.");
// }

// function mostrarFechaHora() {
//     const ahora = new Date();
//     const fechaHora = ahora.toLocaleString();
//     document.getElementById("fechaHoraActual").textContent = fechaHora;
// }
// setInterval(mostrarFechaHora, 1000)
// mostrarFechaHora()

