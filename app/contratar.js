import { validarCampo, validarFormularioCompleto } from '../modules/validations.js';
import { guardarDatosLocalStorage, guardarDatosSessionStorage } from '../modules/storage.js';
import { actualizarProgreso, mostrarModalResumen } from '../modules/ui.js';
import { translationService } from './translationService.js';

// Función de utilidad para mostrar notificaciones
function mostrarNotificacion(tipo, claveTitulo, claveMensaje, duracion = 3000) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: duracion,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    const titulo = translationService.getTranslation(claveTitulo) || claveTitulo;
    const mensaje = translationService.getTranslation(claveMensaje) || claveMensaje;

    Toast.fire({
        icon: tipo,
        title: titulo,
        text: mensaje
    });
}

let optionalFormsConfig = null;
let coberturas = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar traducciones al inicio
    try {
        await translationService.loadTranslations();
        // Cargar configuración de formularios opcionales
        const response = await fetch('/config/optionalForms.json');
        optionalFormsConfig = await response.json();
        // Cargar configuración de coberturas
        const responseCoverages = await fetch('../config/coverages.json');
        if (!responseCoverages.ok) {
            throw new Error(`HTTP error! status: ${responseCoverages.status}`);
        }
        coberturas = await responseCoverages.json();
        console.log('Coberturas cargadas correctamente:', coberturas);
        mostrarNotificacion('success', 'notif_system_ready', 'notif_system_ready_desc');
    } catch (error) {
        console.error('Error al cargar configuraciones:', error);
        mostrarNotificacion('error', 'notif_system_error', 'notif_system_error_desc');
    
        coberturas = {
            'bienes personales': [],
            'vida': [],
            'automovil': [],
            'ART': []
        };
    }

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

    // Función para traducir un elemento
    function translateElement(element) {
        const key = element.getAttribute('data-translate');
        if (key) {
            element.textContent = translationService.getTranslation(key);
        }
    }

    // Función para crear campos de formulario
    function createFormField(fieldConfig) {
        const div = document.createElement('div');
        div.className = 'mb-3';
        
        const label = document.createElement('label');
        label.className = 'form-label';
        label.setAttribute('data-translate', fieldConfig.label);
        label.htmlFor = fieldConfig.id;
        
        const input = document.createElement('input');
        input.type = fieldConfig.type;
        input.className = 'form-control';
        input.id = fieldConfig.id;
        input.setAttribute('data-translate-placeholder', fieldConfig.placeholder);
        
        div.appendChild(label);
        div.appendChild(input);
        
        return div;
    }

    // Función para mostrar formulario opcional
    function showOptionalForm(type) {
        const formContainer = document.getElementById('optionalFormContainer');
        formContainer.innerHTML = '';
        
        const title = document.createElement('h4');
        title.className = 'mb-4';
        title.setAttribute('data-translate', `${type}_data`);
        
        formContainer.appendChild(title);
        
        const config = optionalFormsConfig[type];
        if (config) {
            config.fields.forEach(field => {
                const fieldElement = createFormField(field);
                formContainer.appendChild(fieldElement);
            });
        }
        
        // Traducir todos los elementos
        translationService.updateTranslations();
    }

    // Función para traducir elementos dinámicos
    function translateDynamicElements() {
        translationService.updateTranslations();
    }

    // Escuchar cambios en el idioma
    document.addEventListener('languageChanged', () => {
        translateDynamicElements();
    });

    function mostrarCoberturas(tipoSeguro) {
        tipoSeguroSeleccionado = tipoSeguro;
        actualizarProgreso(2);
        mostrarNotificacion('info', 'notif_select_coverage', 'notif_select_coverage_desc');

        if (contenedorCoberturasActivo) {
            contenedorCoberturasActivo.remove();
            contenedorCoberturasActivo = '';
        }

        if (coberturas && coberturas[tipoSeguro]) {
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
                tituloCobertura.setAttribute('data-translate', cobertura.key);

                const descripcionCobertura = document.createElement('p');
                descripcionCobertura.classList.add('descripcion-cobertura');
                if (cobertura.descripcionKey) {
                    descripcionCobertura.setAttribute('data-translate', cobertura.descripcionKey);
                }

                tarjetaCobertura.appendChild(iconoCobertura);
                tarjetaCobertura.appendChild(tituloCobertura);
                if (cobertura.descripcionKey) {
                    tarjetaCobertura.appendChild(descripcionCobertura);
                }
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
            translateDynamicElements();
        } else {
            mostrarNotificacion('error', 'notif_system_error', 'notif_system_error_desc');
        }
    }

    function mostrarFormularioContacto(tipoSeguro, cobertura) {
        try {
            console.log('Mostrando formulario para:', tipoSeguro, cobertura);
            actualizarProgreso(3);
            mostrarNotificacion('info', 'notif_new_form', 'notif_new_form_desc', 2000);
            
            const formularioContacto = document.createElement('form');
            formularioContacto.classList.add('formulario-contacto');
            formularioContacto.setAttribute('role', 'form');
            formularioContacto.setAttribute('aria-label', `Formulario de contacto para ${tipoSeguro} - ${cobertura}`);

            // Verificar que translationService esté disponible
            if (!translationService) {
                throw new Error('Servicio de traducción no disponible');
            }

            // Obtener traducciones
            const requestAdviceText = translationService.getTranslation('requestAdvice') || 'Solicitar asesoramiento para';
            const nameLabel = translationService.getTranslation('name') || 'Nombre';
            const lastNameLabel = translationService.getTranslation('lastName') || 'Apellido';
            const phoneLabel = translationService.getTranslation('phone') || 'Teléfono';
            const emailLabel = translationService.getTranslation('email') || 'Email';
            const namePlaceholder = translationService.getTranslation('namePlaceholder') || 'Ingrese su nombre';
            const lastNamePlaceholder = translationService.getTranslation('lastNamePlaceholder') || 'Ingrese su apellido';
            const phonePlaceholder = translationService.getTranslation('phonePlaceholder') || 'Ingrese su teléfono';
            const emailPlaceholder = translationService.getTranslation('emailPlaceholder') || 'Ingrese su email';
            const moreInfoText = translationService.getTranslation('moreInfo') || 'Quiero cargar más información';
            const confirmText = translationService.getTranslation('confirm') || 'Confirmar';

            formularioContacto.innerHTML = `
                <h3 class="form-title" id="formulario-titulo">${requestAdviceText} ${tipoSeguro.toUpperCase()} > ${cobertura.toUpperCase()}</h3>
                <div>
                    <label for="nombre" data-translate="name">${nameLabel}</label>
                    <input type="text" id="nombre" name="nombre" required aria-required="true" data-translate-placeholder="namePlaceholder" placeholder="${namePlaceholder}">
                    <span class="error-message" id="nombre-error" role="alert"></span>
                </div>
                <div>
                    <label for="apellido" data-translate="lastName">${lastNameLabel}</label>
                    <input type="text" id="apellido" name="apellido" required aria-required="true" data-translate-placeholder="lastNamePlaceholder" placeholder="${lastNamePlaceholder}">
                    <span class="error-message" id="apellido-error" role="alert"></span>
                </div>
                <div>
                    <label for="telefono" data-translate="phone">${phoneLabel}</label>
                    <input type="tel" id="telefono" name="telefono" required aria-required="true" data-translate-placeholder="phonePlaceholder" placeholder="${phonePlaceholder}">
                    <span class="error-message" id="telefono-error" role="alert"></span>
                </div>
                <div>
                    <label for="email" data-translate="email">${emailLabel}</label>
                    <input type="email" id="email" name="email" aria-required="false" data-translate-placeholder="emailPlaceholder" placeholder="${emailPlaceholder}">
                    <span class="error-message" id="email-error" role="alert"></span>
                </div>
                <button type="button" id="cargar-mas-info-btn" aria-expanded="false" data-translate="moreInfo">${moreInfoText}</button>
                <div id="formulario-opcional-container" style="display: none;" aria-hidden="true">
                </div>
                <button type="button" id="confirmar-datos-btn" disabled aria-disabled="true" data-translate="confirm">${confirmText}</button>
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
                    mostrarFormularioOpcional(tipoSeguro);
                }
                // Evitar que el título se actualice
                const tituloFormulario = document.getElementById('formulario-titulo');
                if (tituloFormulario) {
                    tituloFormulario.removeAttribute('data-translate');
                }
            });

            function actualizarEstadoBotonConfirmar() {
                const formularioContacto = document.querySelector('.formulario-contacto');
                const confirmarDatosBtn = document.querySelector('#confirmar-datos-btn');
                
                if (validarFormularioCompleto(formularioContacto)) {
                    confirmarDatosBtn.disabled = false;
                    confirmarDatosBtn.classList.remove('disabled');
                    mostrarNotificacion('success', 'notif_form_complete', 'notif_form_complete_desc');
                } else {
                    confirmarDatosBtn.disabled = true;
                    confirmarDatosBtn.classList.add('disabled');
                }
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
                        title: translationService.getTranslation('requiredFields') || 'Campos requeridos',
                        text: translationService.getTranslation('completeRequiredFields') || 'Por favor, complete los campos requeridos.',
                        confirmButtonText: translationService.getTranslation('understood') || 'Entendido',
                        confirmButtonColor: '#007bff'
                    });
                }
            });

        } catch (error) {
            console.error('Error en mostrarFormularioContacto:', error);
            mostrarNotificacion('error', 'notif_form_error', 'notif_form_error_desc');
        }
    }

    function obtenerDatosFormularioOpcional(container) {
        const datos = {};
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            datos[input.name] = input.value;
        });
        mostrarNotificacion('success', 'notif_data_saved', 'notif_data_saved_desc');
        return datos;
    }

    function mostrarFormularioOpcional(tipoSeguro) {
        // Normalizar el tipo de seguro para que coincida con las claves del mapeo
        const tipoSeguroNormalizado = tipoSeguro.toLowerCase().trim();
        
        const tipoConfigMap = {
            'automovil': 'auto',
            'bienes personales': 'hogar',
            'vida': 'vida',
            'art': 'art'
        };

        const tipoConfig = tipoConfigMap[tipoSeguroNormalizado];
        if (!tipoConfig) {
            console.error('Tipo de seguro no válido:', tipoSeguro);
            mostrarNotificacion('error', 'notif_form_error', 'notif_form_error_desc');
            return;
        }

        if (!optionalFormsConfig) {
            console.error('Configuración de formularios opcionales no cargada');
            mostrarNotificacion('error', 'notif_system_error', 'notif_system_error_desc');
            return;
        }

        const config = optionalFormsConfig[tipoConfig];
        if (!config) {
            console.error('Configuración no encontrada para:', tipoConfig);
            mostrarNotificacion('error', 'notif_form_error', 'notif_form_error_desc');
            return;
        }

        const formularioOpcional = document.createElement('div');
        formularioOpcional.className = 'formulario-opcional mt-4';
        formularioOpcional.innerHTML = `
            <h4 data-translate="${config.titleKey}">${translationService.getTranslation(config.titleKey)}</h4>
            <div class="row">
                ${config.fields.map(field => `
                    <div class="col-md-6 mb-3">
                        <label for="${field.id}" data-translate="${field.labelKey}">${translationService.getTranslation(field.labelKey)}</label>
                        ${field.type === 'select' ? `
                            <select class="form-control" 
                                    id="${field.id}" 
                                    name="${field.id}"
                                    data-translate-placeholder="${field.placeholderKey}">
                                <option value="" disabled selected>${translationService.getTranslation(field.placeholderKey)}</option>
                                ${field.options.map(option => `
                                    <option value="${option.value}" data-translate="${option.labelKey}">
                                        ${translationService.getTranslation(option.labelKey)}
                                    </option>
                                `).join('')}
                            </select>
                        ` : `
                            <input type="${field.type}" 
                                   class="form-control" 
                                   id="${field.id}" 
                                   name="${field.id}"
                                   data-translate-placeholder="${field.placeholderKey}"
                                   placeholder="${translationService.getTranslation(field.placeholderKey)}">
                        `}
                    </div>
                `).join('')}
            </div>
        `;

        const contenedorFormulario = document.querySelector('#formulario-opcional-container');
        if (contenedorFormulario) {
            contenedorFormulario.innerHTML = '';
            contenedorFormulario.appendChild(formularioOpcional);
            translateDynamicElements();
            mostrarNotificacion('success', 'notif_form_loaded', 'notif_form_loaded_desc');
        }
    }

    cerrarModalBtn.addEventListener('click', () => {
        modalResumen.style.display = 'none';
        mostrarNotificacion('info', 'notif_modal_closed', 'notif_modal_closed_desc');
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

    // Actualizar el evento de cambio de tipo de seguro
    document.querySelectorAll('.tipo-seguro').forEach(button => {
        button.addEventListener('click', function() {
            const tipoSeguro = this.getAttribute('data-tipo');
            mostrarFormularioOpcional(tipoSeguro);
        });
    });
});