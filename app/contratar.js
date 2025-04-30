import { validarCampo, validarFormularioCompleto } from '../modules/validations.js';
import { guardarDatosLocalStorage, guardarDatosSessionStorage } from '../modules/storage.js';
import { cargarFormularioOpcional, actualizarProgreso, mostrarModalResumen } from '../modules/ui.js';
import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    const botonesSeguroPrincipal = document.querySelectorAll('.tarjeta-boton');
    const contenedorBotonesPrincipal = document.querySelector('.contenedor-botones');
    const contenedorFormularios = document.querySelector('.contenedor-formularios');
    const modalResumen = document.getElementById('modal-resumen');
    const cerrarModalBtn = modalResumen.querySelector('.cerrar-modal');
    const editarDatosBtn = modalResumen.querySelector('#editar-datos-btn');
    const enviarMailBtn = modalResumen.querySelector('#enviar-mail-btn');
    const enviarWhatsappBtn = modalResumen.querySelector('#enviar-whatsapp-btn');
    const cancelarOperacionBtn = modalResumen.querySelector('#cancelar-operacion-btn');
    let tarjetaPrincipalActiva = '';
    let contenedorCoberturasActivo = '';
    let tipoSeguroSeleccionado = '';
    let coberturaSeleccionada = '';
    let datosContactoGuardados = '';
    let datosOpcionalesGuardados = '';

    actualizarProgreso(1);

    // Array Coberturas
    const coberturas = {
        'bienes personales': [
            { tipo: 'Domicilio Particular', icono: 'bi-house-door' },
            { tipo: 'Departamento', icono: 'bi-building' },
            { tipo: 'Comercios', icono: 'bi-shop' },
            { tipo: 'Edificios', icono: 'bi-buildings' },
            { tipo: 'Terrenos', icono: 'bi-tree' }
        ],
        vida: [
            { tipo: 'Individual', icono: 'bi-person' },
            { tipo: 'Familiar', icono: 'bi-people' },
            { tipo: 'Con Ahorro', icono: 'bi-piggy-bank' },
            { tipo: 'Temporario', icono: 'bi-clock' }
        ],
        automovil: [
            { tipo: 'Autos 4 puertas', icono: 'bi-car-front' },
            { tipo: 'Autos 5 puertas', icono: 'bi-car-front-fill' },
            { tipo: 'Motos', icono: 'bi-bicycle' },
            { tipo: 'Camionetas / SUVs', icono: 'bi-truck' },
            { tipo: 'Vehículos Comerciales', icono: 'bi-truck-flatbed' }
        ],
        ART: [
            { tipo: 'Plan Básico', icono: 'bi-hospital' },
            { tipo: 'Plan Medio', icono: 'bi-hospital-fill' },
            { tipo: 'Plan Premium', icono: 'bi-file-medical' },
            { tipo: 'Dental', icono: 'bi-bandaid' }
        ]
    };

    // Función para traducir elementos dinámicos
    function translateDynamicElements() {
        const lang = document.documentElement.lang || 'es';
        const t = translations[lang];

        // Traducir títulos de coberturas
        const coberturaTitles = document.querySelectorAll('.tarjeta-cobertura h4');
        coberturaTitles.forEach(title => {
            const key = title.getAttribute('data-translate');
            if (key && t[key]) {
                title.textContent = t[key];
            }
        });

        // Traducir formulario de contacto si existe
        const formularioContacto = document.querySelector('.formulario-contacto');
        if (formularioContacto) {
            // Traducir elementos con data-translate
            const elements = formularioContacto.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (t[key]) {
                    element.textContent = t[key];
                }
            });

            // Traducir placeholders
            const inputs = formularioContacto.querySelectorAll('input[data-translate-placeholder]');
            inputs.forEach(input => {
                const key = input.getAttribute('data-translate-placeholder');
                if (t[key]) {
                    input.placeholder = t[key];
                }
            });

            // Actualizar mensajes de error existentes
            const errorSpans = formularioContacto.querySelectorAll('.error-message');
            errorSpans.forEach(span => {
                const input = formularioContacto.querySelector(`#${span.id.replace('-error', '')}`);
                if (input && span.textContent) {
                    validarCampo(input, span);
                }
            });
        }
    }

    // Escuchar cambios en el idioma
    document.addEventListener('languageChanged', () => {
        translateDynamicElements();
    });

    function mostrarCoberturas(tipoSeguro) {
        tipoSeguroSeleccionado = tipoSeguro;
        actualizarProgreso(2);

        if (contenedorCoberturasActivo) {
            contenedorCoberturasActivo.remove();
            contenedorCoberturasActivo = '';
        }

        if (coberturas[tipoSeguro]) {
            contenedorCoberturasActivo = document.createElement('div');
            contenedorCoberturasActivo.classList.add('contenedor-coberturas');

            coberturas[tipoSeguro].forEach(cobertura => {
                const tarjetaCobertura = document.createElement('div');
                tarjetaCobertura.classList.add('tarjeta-cobertura');
                tarjetaCobertura.dataset.cobertura = cobertura.tipo;

                const iconoCobertura = document.createElement('i');
                iconoCobertura.classList.add('bi', cobertura.icono, 'icono-cobertura');

                const tituloCobertura = document.createElement('h4');
                tituloCobertura.textContent = cobertura.tipo;
                tituloCobertura.setAttribute('data-translate', `coverage_${cobertura.tipo.toLowerCase().replace(/ /g, '_')}`);

                tarjetaCobertura.appendChild(iconoCobertura);
                tarjetaCobertura.appendChild(tituloCobertura);
                contenedorCoberturasActivo.appendChild(tarjetaCobertura);

                tarjetaCobertura.addEventListener('click', () => {
                    coberturaSeleccionada = cobertura.tipo;
                    contenedorFormularios.innerHTML = '';
                    mostrarFormularioContacto(tipoSeguro, cobertura.tipo);

                    if (contenedorCoberturasActivo) {
                        contenedorCoberturasActivo.querySelectorAll('.tarjeta-cobertura.active').forEach(t => t.classList.remove('active'));
                    }
                    tarjetaCobertura.classList.add('active');
                });
            });

            contenedorBotonesPrincipal.insertAdjacentElement('afterend', contenedorCoberturasActivo);
            
            // Traducir elementos inmediatamente después de crearlos
            translateDynamicElements();
        }
    }

    function mostrarFormularioContacto(tipoSeguro, cobertura) {
        actualizarProgreso(3);
        const formularioContacto = document.createElement('form');
        formularioContacto.classList.add('formulario-contacto');
        formularioContacto.setAttribute('role', 'form');
        formularioContacto.setAttribute('aria-label', `Formulario de contacto para ${tipoSeguro} - ${cobertura}`);

        const lang = document.documentElement.lang || 'es';
        const t = translations[lang];

        formularioContacto.innerHTML = `
            <h3 data-translate="requestAdvice">${t.requestAdvice} ${tipoSeguro.toUpperCase()} > ${cobertura.toUpperCase()}</h3>
            <div>
                <label for="nombre" data-translate="name">${t.name}</label>
                <input type="text" id="nombre" name="nombre" required aria-required="true" data-translate-placeholder="namePlaceholder" placeholder="${t.namePlaceholder}">
                <span class="error-message" id="nombre-error" role="alert"></span>
            </div>
            <div>
                <label for="apellido" data-translate="lastName">${t.lastName}</label>
                <input type="text" id="apellido" name="apellido" required aria-required="true" data-translate-placeholder="lastNamePlaceholder" placeholder="${t.lastNamePlaceholder}">
                <span class="error-message" id="apellido-error" role="alert"></span>
            </div>
            <div>
                <label for="telefono" data-translate="phone">${t.phone}</label>
                <input type="tel" id="telefono" name="telefono" required aria-required="true" data-translate-placeholder="phonePlaceholder" placeholder="${t.phonePlaceholder}">
                <span class="error-message" id="telefono-error" role="alert"></span>
            </div>
            <div>
                <label for="email" data-translate="email">${t.email}</label>
                <input type="email" id="email" name="email" aria-required="false" data-translate-placeholder="emailPlaceholder" placeholder="${t.emailPlaceholder}">
                <span class="error-message" id="email-error" role="alert"></span>
            </div>
            <button type="button" id="cargar-mas-info-btn" aria-expanded="false" data-translate="moreInfo">${t.moreInfo}</button>
            <div id="formulario-opcional-container" style="display: none;" aria-hidden="true">
            </div>
            <button type="button" id="confirmar-datos-btn" disabled aria-disabled="true" data-translate="confirm">${t.confirm}</button>
        `;

        contenedorFormularios.appendChild(formularioContacto);

        const cargarMasInfoBtn = formularioContacto.querySelector('#cargar-mas-info-btn');
        const formularioOpcionalContainer = formularioContacto.querySelector('#formulario-opcional-container');
        const confirmarDatosBtn = formularioContacto.querySelector('#confirmar-datos-btn');

        formularioContacto.addEventListener('input', (e) => {
            if (e.target.matches('input') && e.target.closest('.formulario-contacto')) {
                const errorSpan = formularioContacto.querySelector(`#${e.target.id}-error`);
                if (errorSpan) {
                    validarCampo(e.target, errorSpan);
                    actualizarEstadoBotonConfirmar();
                }
            }
        });

        formularioContacto.addEventListener('blur', (e) => {
            if (e.target.matches('input') && e.target.closest('.formulario-contacto')) {
                const errorSpan = formularioContacto.querySelector(`#${e.target.id}-error`);
                if (errorSpan) {
                    validarCampo(e.target, errorSpan);
                    actualizarEstadoBotonConfirmar();
                }
            }
        }, true);

        cargarMasInfoBtn.addEventListener('click', () => {
            const isExpanded = cargarMasInfoBtn.getAttribute('aria-expanded') === 'true';
            cargarMasInfoBtn.setAttribute('aria-expanded', !isExpanded);
            formularioOpcionalContainer.style.display = isExpanded ? 'none' : 'block';
            formularioOpcionalContainer.setAttribute('aria-hidden', isExpanded);
            if (!isExpanded) {
                cargarFormularioOpcional(tipoSeguro, formularioOpcionalContainer);
            }
        });

        function actualizarEstadoBotonConfirmar() {
            confirmarDatosBtn.disabled = !validarFormularioCompleto(formularioContacto);
            confirmarDatosBtn.classList.toggle('disabled', confirmarDatosBtn.disabled);
        }

        actualizarEstadoBotonConfirmar();

        confirmarDatosBtn.addEventListener('click', () => {
            actualizarProgreso(4);
            if (!confirmarDatosBtn.disabled) {
                const datosContacto = {
                    nombre: formularioContacto.querySelector('#nombre').value,
                    apellido: formularioContacto.querySelector('#apellido').value,
                    telefono: formularioContacto.querySelector('#telefono').value,
                    email: formularioContacto.querySelector('#email').value
                };
                const datosOpcionales = obtenerDatosFormularioOpcional(formularioOpcionalContainer);
                datosContactoGuardados = { ...datosContacto };
                datosOpcionalesGuardados = { ...datosOpcionales };
                guardarDatosLocalStorage(tipoSeguro, cobertura, datosContacto);
                guardarDatosSessionStorage(tipoSeguro, cobertura, datosOpcionales);
                mostrarModalResumen(tipoSeguro, cobertura, datosContacto, datosOpcionales);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: t?.requiredFields || 'Campos requeridos',
                    text: t?.completeRequiredFields || 'Por favor, complete los campos requeridos.',
                    confirmButtonText: t?.understood || 'Entendido',
                    confirmButtonColor: '#007bff'
                });
            }
        });
    }

    function obtenerDatosFormularioOpcional(container) {
        const datos = {};
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            datos[input.name] = input.value;
        });
        return datos;
    }

    cerrarModalBtn.addEventListener('click', () => {
        modalResumen.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalResumen) {
            modalResumen.style.display = 'none';
        }
    });

    editarDatosBtn.addEventListener('click', () => {
        modalResumen.style.display = 'none';
    });

    enviarMailBtn.addEventListener('click', () => {
        const asunto = `Resumen de Solicitud de Seguro - ${tipoSeguroSeleccionado} - ${coberturaSeleccionada} (${new Date().toLocaleString()})`;
        let cuerpo = `Resumen de solicitud de cobertura:\n\n`;
        cuerpo += `Tipo de Seguro: ${tipoSeguroSeleccionado}\n`;
        cuerpo += `Cobertura: ${coberturaSeleccionada}\n`;
        cuerpo += `Fecha y Hora: ${new Date().toLocaleString()}\n\n`;
        cuerpo += `Datos de Contacto:\n`;
        cuerpo += `Nombre: ${datosContactoGuardados?.nombre}\n`;
        cuerpo += `Apellido: ${datosContactoGuardados?.apellido}\n`;
        cuerpo += `Teléfono: ${datosContactoGuardados?.telefono}\n`;
        if (datosContactoGuardados?.email) {
            cuerpo += `Email: ${datosContactoGuardados.email}\n`;
        }

        if (datosOpcionalesGuardados && Object.keys(datosOpcionalesGuardados).length > 0) {
            cuerpo += `\nInformación Adicional:\n`;
            for (const key in datosOpcionalesGuardados) {
                cuerpo += `${key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}: ${datosOpcionalesGuardados[key]}\n`;
            }
        }

        const mailtoUrl = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        window.open(mailtoUrl);
        
        Swal.fire({
            icon: 'success',
            title: 'Email enviado',
            text: 'Se ha abierto su cliente de correo electrónico con el resumen de la solicitud.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#007bff'
        }).then(() => {
            // Limpiar datos y cerrar modal
            modalResumen.style.display = 'none';
            contenedorFormularios.innerHTML = '';
            if (tarjetaPrincipalActiva) {
                tarjetaPrincipalActiva.classList.remove('active');
                tarjetaPrincipalActiva = '';
            }
            if (contenedorCoberturasActivo) {
                contenedorCoberturasActivo.remove();
                contenedorCoberturasActivo = '';
            }
            tipoSeguroSeleccionado = '';
            coberturaSeleccionada = '';
            datosContactoGuardados = '';
            datosOpcionalesGuardados = '';
        });
    });

    enviarWhatsappBtn.addEventListener('click', () => {
        const numeroTelefonoEjemplo = '5491169732701';
        const mensaje = `Resumen de mi solicitud de seguro:\n\n` +
            `Tipo de Seguro: ${tipoSeguroSeleccionado}\n` +
            `Cobertura: ${coberturaSeleccionada}\n` +
            `Fecha y Hora: ${new Date().toLocaleString()}\n\n` +
            `Datos de Contacto:\n` +
            `Nombre: ${datosContactoGuardados?.nombre}\n` +
            `Apellido: ${datosContactoGuardados?.apellido}\n` +
            `Teléfono: ${datosContactoGuardados?.telefono}\n` +
            (datosContactoGuardados?.email ? `Email: ${datosContactoGuardados.email}\n` : '') +
            (datosOpcionalesGuardados && Object.keys(datosOpcionalesGuardados).length > 0 ? `\nInformación Adicional:\n` : '') +
            Object.keys(datosOpcionalesGuardados || {})
                .map(key => `${key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}: ${datosOpcionalesGuardados[key]}`)
                .join('\n');

        const whatsappUrl = `https://wa.me/${numeroTelefonoEjemplo}?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl);
        
        Swal.fire({
            icon: 'success',
            title: 'Enviar datos por Whatsapp',
            text: 'Se ha iniciado el chat por WhatsApp con el resumen de la solicitud.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#007bff'
        }).then(() => {
            // Limpiar datos y cerrar modal
            modalResumen.style.display = 'none';
            contenedorFormularios.innerHTML = '';
            if (tarjetaPrincipalActiva) {
                tarjetaPrincipalActiva.classList.remove('active');
                tarjetaPrincipalActiva = '';
            }
            if (contenedorCoberturasActivo) {
                contenedorCoberturasActivo.remove();
                contenedorCoberturasActivo = '';
            }
            tipoSeguroSeleccionado = '';
            coberturaSeleccionada = '';
            datosContactoGuardados = '';
            datosOpcionalesGuardados = '';
        });
    });

    cancelarOperacionBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Reiniciar y eliminar datos ¿Está seguro?',
            text: "Esta acción cancelará la operación actual y reiniciará el proceso",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                modalResumen.style.display = 'none';
                contenedorFormularios.innerHTML = '';
                if (tarjetaPrincipalActiva) {
                    tarjetaPrincipalActiva.classList.remove('active');
                    tarjetaPrincipalActiva = '';
                }
                if (contenedorCoberturasActivo) {
                    contenedorCoberturasActivo.remove();
                    contenedorCoberturasActivo = '';
                }
                tipoSeguroSeleccionado = '';
                coberturaSeleccionada = '';
                datosContactoGuardados = '';
                datosOpcionalesGuardados = '';

                Swal.fire({
                    icon: 'success',
                    title: 'Operación cancelada',
                    text: 'El proceso ha sido reiniciado correctamente',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#007bff'
                });
            }
        });
    });

    botonesSeguroPrincipal.forEach(boton => {
        boton.addEventListener('click', () => {
            if (tarjetaPrincipalActiva) {
                tarjetaPrincipalActiva.classList.remove('active');
            }
            boton.classList.add('active');
            tarjetaPrincipalActiva = boton;

            const target = boton.dataset.target;
            mostrarCoberturas(target);
        });

        boton.addEventListener('mouseenter', () => {
            boton.style.transform = 'scale(1.05)';
        });

        boton.addEventListener('mouseleave', () => {
            if (!boton.classList.contains('active')) {
                boton.style.transform = 'scale(1)';
            }
        });

        boton.addEventListener('focus', () => {
            boton.classList.add('focused');
        });

        boton.addEventListener('blur', () => {
            boton.classList.remove('focused');
        });
    });
});