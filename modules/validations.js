import { camposRequeridos } from '../config/fieldsConfig.js';

export function validarCampo(input, errorSpan) {
    const valor = input.value.trim();
    const campoConfig = camposRequeridos[input.id];
    let mensajeError = '';
    let esValido = true;

    if (!campoConfig) return true;

    if (input.required && valor === '') {
        mensajeError = campoConfig.errorMessages.required;
        esValido = false;
    } else if (valor !== '') {
        if (campoConfig.minLength && valor.length < campoConfig.minLength) {
            mensajeError = campoConfig.errorMessages.minLength;
            esValido = false;
        } else if (campoConfig.maxLength && valor.length > campoConfig.maxLength) {
            mensajeError = campoConfig.errorMessages.maxLength;
            esValido = false;
        } else if (campoConfig.pattern && !campoConfig.pattern.test(valor)) {
            mensajeError = campoConfig.errorMessages.pattern;
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