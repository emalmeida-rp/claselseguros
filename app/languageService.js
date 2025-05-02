import { translationService } from './translationService.js';

class LanguageService {
    constructor() {
        this.languageSelect = document.getElementById('language-select');
        this.init();
    }

    async init() {
        try {
            // Cargar traducciones primero
            await translationService.loadTranslations();
            
            // Cargar idioma guardado o usar el predeterminado
            const savedLang = localStorage.getItem('preferredLanguage') || 'es';
            this.setLanguage(savedLang);

            // Escuchar cambios en el selector de idioma
            this.languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        } catch (error) {
            console.error('Error al inicializar el servicio de idiomas:', error);
        }
    }

    setLanguage(lang) {
        try {
            // Actualizar el selector
            this.languageSelect.value = lang;
            
            // Actualizar el atributo lang del documento
            document.documentElement.lang = lang;
            
            // Guardar preferencia
            localStorage.setItem('preferredLanguage', lang);
            
            // Actualizar traducciones
            translationService.setLanguage(lang);
            
            // Disparar evento personalizado
            const event = new CustomEvent('languageChanged', {
                detail: { language: lang }
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Error al cambiar el idioma:', error);
        }
    }

    getCurrentLanguage() {
        return document.documentElement.lang || 'es';
    }
}

// Exportar una instancia única del servicio
export const languageService = new LanguageService(); 