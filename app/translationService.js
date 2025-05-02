class TranslationService {
    constructor() {
        this.translations = null;
        this.currentLang = document.documentElement.lang || 'es';
        this.isLoading = false;
    }

    async loadTranslations() {
        if (this.isLoading) {
            return;
        }

        try {
            this.isLoading = true;
            const response = await fetch('/app/translations.json');
            if (!response.ok) {
                throw new Error(`Error al cargar traducciones: ${response.status}`);
            }
            this.translations = await response.json();
            this.isLoading = false;
            return this.translations;
        } catch (error) {
            console.error('Error en la carga de traducciones:', error);
            this.isLoading = false;
            throw new Error('No se pudieron cargar las traducciones. Por favor, intente nuevamente.');
        }
    }

    getTranslation(key, lang = this.currentLang) {
        try {
            if (!this.translations) {
                console.warn('Las traducciones no han sido cargadas');
                return key;
            }

            if (!this.translations[lang]) {
                console.warn(`Idioma ${lang} no encontrado, usando español como fallback`);
                lang = 'es';
            }

            const translation = this.translations[lang][key];
            if (!translation) {
                console.warn(`Traducción no encontrada para la clave: ${key}`);
                return key;
            }

            return translation;
        } catch (error) {
            console.error('Error al obtener traducción:', error);
            return key;
        }
    }

    setLanguage(lang) {
        try {
            if (!this.translations) {
                console.warn('Las traducciones no han sido cargadas');
                return;
            }

            if (!this.translations[lang]) {
                console.warn(`Idioma ${lang} no soportado, usando español como fallback`);
                lang = 'es';
            }

            this.currentLang = lang;
            document.documentElement.lang = lang;
            this.updateTranslations();
        } catch (error) {
            console.error('Error al cambiar idioma:', error);
        }
    }

    updateTranslations() {
        try {
            if (!this.translations) {
                console.warn('Las traducciones no han sido cargadas');
                return;
            }

            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.getTranslation(key);
                element.textContent = translation;
            });

            const placeholders = document.querySelectorAll('[data-translate-placeholder]');
            placeholders.forEach(element => {
                const key = element.getAttribute('data-translate-placeholder');
                const translation = this.getTranslation(key);
                element.placeholder = translation;
            });
        } catch (error) {
            console.error('Error al actualizar traducciones:', error);
        }
    }
}

// Exportar una instancia única del servicio
export const translationService = new TranslationService(); 