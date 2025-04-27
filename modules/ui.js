import { camposOpcionalesConfig } from '../config/fieldsConfig.js';

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
    if (!container || !(container instanceof Element)) {
        console.error('El container proporcionado no es un elemento DOM válido');
        return;
    }

    container.innerHTML = '';
    const botonOcultar = document.createElement('button');
    botonOcultar.textContent = 'Ocultar información adicional';
    botonOcultar.type = 'button';
    botonOcultar.addEventListener('click', () => {
        container.style.display = 'none';
        container.innerHTML = '';
    });

    let formularioOpcionalHTML = '<h4>Información Adicional (Opcional)</h4>';
    
    if (camposOpcionalesConfig[tipoSeguro]) {
        formularioOpcionalHTML += camposOpcionalesConfig[tipoSeguro]
            .map(campo => generarHTMLCampo(campo))
            .join('');
    } else {
        formularioOpcionalHTML += '<p>No hay información adicional para cargar.</p>';
    }

    container.innerHTML = formularioOpcionalHTML;
    container.appendChild(botonOcultar);
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

    modalTitulo.textContent = `Usted eligió ${tipoSeguro.toUpperCase()} ${cobertura.toUpperCase()} (${new Date().toLocaleString()})`;
    modalDatos.innerHTML = '';

    const agregarDatoAlResumen = (label, value) => {
        if (value) {
            const listItem = document.createElement('li');
            listItem.textContent = `${label}: ${value}`;
            modalDatos.appendChild(listItem);
        }
    };

    agregarDatoAlResumen('Nombre', datosContacto.nombre);
    agregarDatoAlResumen('Apellido', datosContacto.apellido);
    agregarDatoAlResumen('Teléfono', datosContacto.telefono);
    agregarDatoAlResumen('Email', datosContacto.email);

    for (const key in datosOpcionales) {
        agregarDatoAlResumen(key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '), datosOpcionales[key]);
    }

    modalResumen.style.display = 'block';
} 