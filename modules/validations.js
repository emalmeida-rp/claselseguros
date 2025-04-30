import { camposRequeridos } from '../config/fieldsConfig.js';
import { translations } from '../app/translations.js';

export function validarCampo(input, errorSpan) {
    const valor = input.value.trim();
    const campoConfig = camposRequeridos[input.id];
    const lang = document.documentElement.lang || 'es';
    const t = translations[lang];
    let mensajeError = '';
    let esValido = true;

    if (!campoConfig) return true;

    if (input.required && valor === '') {
        mensajeError = t.error_required;
        esValido = false;
    } else if (valor !== '') {
        if (campoConfig.minLength && valor.length < campoConfig.minLength) {
            mensajeError = t.error_min_length.replace('{min}', campoConfig.minLength);
            esValido = false;
        } else if (campoConfig.maxLength && valor.length > campoConfig.maxLength) {
            mensajeError = t.error_max_length.replace('{max}', campoConfig.maxLength);
            esValido = false;
        } else if (campoConfig.pattern && !campoConfig.pattern.test(valor)) {
            // Mensajes específicos según el tipo de campo
            switch (input.id) {
                case 'email':
                    mensajeError = t.error_email;
                    break;
                case 'telefono':
                    mensajeError = t.error_phone;
                    break;
                case 'nombre':
                    mensajeError = t.error_name;
                    break;
                case 'apellido':
                    mensajeError = t.error_lastname;
                    break;
                default:
                    mensajeError = t.error_pattern;
            }
            esValido = false;
        }
    }

    if (errorSpan) {
        errorSpan.textContent = mensajeError;
        input.classList.toggle('error', !esValido);
        input.classList.toggle('success', esValido && valor !== '');
        input.setAttribute('aria-invalid', !esValido);
        input.setAttribute('aria-describedby', !esValido ? errorSpan.id : '');
    }

    return esValido;
}

export function validarFormularioCompleto(formulario) {
    const campos = formulario.querySelectorAll('input[required]');
    return Array.from(campos).every(campo => {
        const errorSpan = formulario.querySelector(`#${campo.id}-error`);
        return validarCampo(campo, errorSpan);
    });
} 