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

// Selector de temas
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const languageSelect = document.getElementById('language-select');
    const body = document.body;
    const htmlElement = document.documentElement;
    
    // Función para aplicar el tema
    function setTheme(theme) {
        // Aplicar transición suave
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
            
            // Definir variables CSS para tema oscuro
            document.documentElement.style.setProperty('--footer-bg-color', '#1a232b');
            document.documentElement.style.setProperty('--footer-text-color', '#ffffff');
            document.documentElement.style.setProperty('--footer-link-color', '#cccccc');
            document.documentElement.style.setProperty('--footer-link-hover-color', '#ffffff');
            document.documentElement.style.setProperty('--footer-border-color', '#404040');
            document.documentElement.style.setProperty('--location-bg-color', '#2d2d2d');
            document.documentElement.style.setProperty('--location-border-color', '#404040');
            document.documentElement.style.setProperty('--location-text-color', '#ffffff');
            document.documentElement.style.setProperty('--button-bg-color', '#3b82f6');
            document.documentElement.style.setProperty('--button-text-color', '#ffffff');
            document.documentElement.style.setProperty('--button-hover-bg-color', '#2563eb');
            document.documentElement.style.setProperty('--map-bg-color', '#404040');
            
            // Aplicar tema oscuro a elementos específicos
            document.querySelectorAll('.card, .navbar, .footer').forEach(element => {
                element.classList.add('dark-theme');
            });
        } else {
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
            
            // Definir variables CSS para tema claro
            document.documentElement.style.setProperty('--footer-bg-color', '#add8e6');
            document.documentElement.style.setProperty('--footer-text-color', '#333333');
            document.documentElement.style.setProperty('--footer-link-color', '#666666');
            document.documentElement.style.setProperty('--footer-link-hover-color', '#000000');
            document.documentElement.style.setProperty('--footer-border-color', '#444444');
            document.documentElement.style.setProperty('--location-bg-color', '#e3f0ff');
            document.documentElement.style.setProperty('--location-border-color', '#b3e0f7');
            document.documentElement.style.setProperty('--location-text-color', '#16324f');
            document.documentElement.style.setProperty('--button-bg-color', '#2563eb');
            document.documentElement.style.setProperty('--button-text-color', '#ffffff');
            document.documentElement.style.setProperty('--button-hover-bg-color', '#1d4ed8');
            document.documentElement.style.setProperty('--map-bg-color', '#b3e0f7');
            
            // Remover tema oscuro de elementos específicos
            document.querySelectorAll('.card, .navbar, .footer').forEach(element => {
                element.classList.remove('dark-theme');
            });
        }
        
        // Guardar preferencia
        localStorage.setItem('theme', theme);
        
        // Emitir evento personalizado para que otros componentes puedan reaccionar
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Función para detectar preferencia del sistema
    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Función para inicializar el tema
    function initializeTheme() {
        const storedTheme = localStorage.getItem('theme');
        const systemTheme = getSystemTheme();
        
        // Usar tema guardado o preferencia del sistema
        const theme = storedTheme || systemTheme;
        setTheme(theme);
        
        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Inicializar tema
    initializeTheme();

    // Event listeners
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Obtener el lenguaje almacenado
    const storedLanguage = localStorage.getItem('language');

    function setLanguage(lang) {
        htmlElement.lang = lang;
        localStorage.setItem('language', lang);
    }

    if (storedLanguage) {
        languageSelect.value = storedLanguage;
        setLanguage(storedLanguage); 
    } else {
        setLanguage('es'); 
    }

    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        setLanguage(selectedLanguage);
    });
});