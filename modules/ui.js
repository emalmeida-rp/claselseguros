import { camposOpcionalesConfig } from '../config/fieldsConfig.js';
import { translations } from '../app/translations.js';

export function generarHTMLCampo(campo) {
    if (campo.type === 'select') {
        return `
            <div>
                <label for="${campo.id}">${campo.label}</label>
                <select id="${campo.id}" name="${campo.id}">
                    ${campo.options.map(opt => `<option value="${opt}">${opt || 'Seleccionar'}</option>`).join('')}
                </select>
            </div>
        `;
    }
    return `
        <div>
            <label for="${campo.id}">${campo.label}</label>
            <input type="${campo.type}" id="${campo.id}" name="${campo.id}">
        </div>
    `;
}

export function cargarFormularioOpcional(tipoSeguro, container) {
    const lang = document.documentElement.lang || 'es';
    const t = translations[lang];

    const formularioOpcional = document.createElement('div');
    formularioOpcional.classList.add('formulario-opcional');
    formularioOpcional.setAttribute('role', 'form');
    formularioOpcional.setAttribute('aria-label', `Formulario opcional para ${tipoSeguro}`);

    formularioOpcional.innerHTML = `
        <div>
            <label for="direccion" data-translate="optional_address">${t.optional_address}</label>
            <input type="text" id="direccion" name="direccion" data-translate-placeholder="optional_address_placeholder" placeholder="${t.optional_address_placeholder}">
        </div>
        <div>
            <label for="ciudad" data-translate="optional_city">${t.optional_city}</label>
            <input type="text" id="ciudad" name="ciudad" data-translate-placeholder="optional_city_placeholder" placeholder="${t.optional_city_placeholder}">
        </div>
        <div>
            <label for="provincia" data-translate="optional_province">${t.optional_province}</label>
            <input type="text" id="provincia" name="provincia" data-translate-placeholder="optional_province_placeholder" placeholder="${t.optional_province_placeholder}">
        </div>
        <div>
            <label for="codigo_postal" data-translate="optional_postal_code">${t.optional_postal_code}</label>
            <input type="text" id="codigo_postal" name="codigo_postal" data-translate-placeholder="optional_postal_code_placeholder" placeholder="${t.optional_postal_code_placeholder}">
        </div>
        <div>
            <label for="fecha_nacimiento" data-translate="optional_birth_date">${t.optional_birth_date}</label>
            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" data-translate-placeholder="optional_birth_date_placeholder" placeholder="${t.optional_birth_date_placeholder}">
        </div>
        <div>
            <label for="documento" data-translate="optional_document">${t.optional_document}</label>
            <input type="text" id="documento" name="documento" data-translate-placeholder="optional_document_placeholder" placeholder="${t.optional_document_placeholder}">
        </div>
        <div>
            <label for="ocupacion" data-translate="optional_occupation">${t.optional_occupation}</label>
            <input type="text" id="ocupacion" name="ocupacion" data-translate-placeholder="optional_occupation_placeholder" placeholder="${t.optional_occupation_placeholder}">
        </div>
        <div>
            <label for="ingresos" data-translate="optional_income">${t.optional_income}</label>
            <input type="number" id="ingresos" name="ingresos" data-translate-placeholder="optional_income_placeholder" placeholder="${t.optional_income_placeholder}">
        </div>
    `;

    container.appendChild(formularioOpcional);
}

export function actualizarProgreso(pasoActual) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index + 1 < pasoActual) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === pasoActual) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

export function mostrarModalResumen(tipoSeguro, cobertura, datosContacto, datosOpcionales) {
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDatos = document.getElementById('modal-datos');
    const modalResumen = document.getElementById('modal-resumen');

    const lang = document.documentElement.lang || 'es';
    const t = translations[lang];

    modalTitulo.textContent = `${t.requestAdvice} ${tipoSeguro.toUpperCase()} > ${cobertura.toUpperCase()} (${new Date().toLocaleString()})`;
    modalDatos.innerHTML = '';

    const agregarDatoAlResumen = (translationKey, value) => {
        if (value) {
            const listItem = document.createElement('li');
            const translatedLabel = t[translationKey] || translationKey;
            const cleanLabel = translatedLabel.replace(/:$/, '');
            listItem.textContent = `${cleanLabel}: ${value}`;
            modalDatos.appendChild(listItem);
        }
    };

    // Datos de contacto
    agregarDatoAlResumen('name', datosContacto.nombre);
    agregarDatoAlResumen('lastName', datosContacto.apellido);
    agregarDatoAlResumen('phone', datosContacto.telefono);
    agregarDatoAlResumen('email', datosContacto.email);

    // Datos opcionales
    if (datosOpcionales) {
        for (const key in datosOpcionales) {
            if (datosOpcionales[key]) {
                const translationKey = `optional_${key}`;
                agregarDatoAlResumen(translationKey, datosOpcionales[key]);
            }
        }
    }

    modalResumen.style.display = 'block';
} 