document.addEventListener('DOMContentLoaded', () => {
    const botonesSeguroPrincipal = document.querySelectorAll('.tarjeta-boton');
    const contenedorBotonesPrincipal = document.querySelector('.contenedor-botones');
    const contenedorFormularios = document.querySelector('.contenedor-formularios');
    const modalResumen = document.getElementById('modal-resumen');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDatos = document.getElementById('modal-datos');
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

    // Datos de las coberturas
    const coberturas = {
        inmuebles: [
            { tipo: 'Casa', icono: '🏠' },
            { tipo: 'Departamento', icono: '🏢' },
            { tipo: 'Local Comercial', icono: '🏦' },
            { tipo: 'Terreno', icono: '🏞️' }
        ],
        vida: [
            { tipo: 'Individual', icono: '👤' },
            { tipo: 'Familiar', icono: '👨‍👩‍👧‍👦' },
            { tipo: 'Con Ahorro', icono: '💰' },
            { tipo: 'Temporario', icono: '⏱️' }
        ],
        automovil: [
            { tipo: 'Autos 4 puertas', icono: '🚗' },
            { tipo: 'Autos 5 puertas', icono: '🚘' },
            { tipo: 'Motos', icono: '🛵' },
            { tipo: 'Camionetas / SUVs', icono: '🛻' },
            { tipo: 'Vehículos Comerciales', icono: '🚚' }
        ],
        salud: [
            { tipo: 'Plan Básico', icono: '🩺' },
            { tipo: 'Plan Medio', icono: '🏥' },
            { tipo: 'Plan Premium', icono: '⚕️' },
            { tipo: 'Dental', icono: '🦷' }
        ]
    };

    function mostrarCoberturas(tipoSeguro) {
        tipoSeguroSeleccionado = tipoSeguro;
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
                iconoCobertura.classList.add('icono-cobertura');
                iconoCobertura.textContent = cobertura.icono;

                const tituloCobertura = document.createElement('h4');
                tituloCobertura.textContent = cobertura.tipo;

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
        }
    }

    function mostrarFormularioContacto(tipoSeguro, cobertura) {
        const formularioContacto = document.createElement('form');
        formularioContacto.classList.add('formulario-contacto');

        formularioContacto.innerHTML = `
            <h3>Ingrese sus datos de contacto para ${tipoSeguro} - ${cobertura}</h3>
            <div>
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required>
                <span class="error-message" id="nombre-error"></span>
            </div>
            <div>
                <label for="apellido">Apellido:</label>
                <input type="text" id="apellido" name="apellido" required>
                <span class="error-message" id="apellido-error"></span>
            </div>
            <div>
                <label for="telefono">Teléfono:</label>
                <input type="tel" id="telefono" name="telefono" required>
                <span class="error-message" id="telefono-error"></span>
            </div>
            <div>
                <label for="email">Email (opcional):</label>
                <input type="email" id="email" name="email">
            </div>
            <button type="button" id="cargar-mas-info-btn">Quiero cargar más información</button>
            <div id="formulario-opcional-container" style="display: none;">
                </div>
            <button type="button" id="confirmar-datos-btn" disabled>Confirmar</button>
        `;

        contenedorFormularios.appendChild(formularioContacto);

        const cargarMasInfoBtn = formularioContacto.querySelector('#cargar-mas-info-btn');
        const formularioOpcionalContainer = formularioContacto.querySelector('#formulario-opcional-container');
        const confirmarDatosBtn = formularioContacto.querySelector('#confirmar-datos-btn');
        const nombreInput = formularioContacto.querySelector('#nombre');
        const apellidoInput = formularioContacto.querySelector('#apellido');
        const telefonoInput = formularioContacto.querySelector('#telefono');
        const emailInput = formularioContacto.querySelector('#email');

        cargarMasInfoBtn.addEventListener('click', () => {
            formularioOpcionalContainer.style.display = 'block';
            cargarFormularioOpcional(tipoSeguro, cobertura, formularioOpcionalContainer);
        });

        function validarCampo(input, errorSpan) {
            if (input.value.trim() === '') {
                errorSpan.textContent = 'Este campo es requerido.';
                return false;
            } else {
                errorSpan.textContent = '';
                return true;
            }
        }

        nombreInput.addEventListener('input', () => validarCampo(nombreInput, formularioContacto.querySelector('#nombre-error')));
        apellidoInput.addEventListener('input', () => validarCampo(apellidoInput, formularioContacto.querySelector('#apellido-error')));
        telefonoInput.addEventListener('input', () => {
            // Aquí podrías agregar una validación más robusta para el teléfono si lo deseas
            validarCampo(telefonoInput, formularioContacto.querySelector('#telefono-error'));
        });

        function verificarFormularioContacto() {
            const nombreValido = validarCampo(nombreInput, formularioContacto.querySelector('#nombre-error'));
            const apellidoValido = validarCampo(apellidoInput, formularioContacto.querySelector('#apellido-error'));
            const telefonoValido = validarCampo(telefonoInput, formularioContacto.querySelector('#telefono-error'));

            confirmarDatosBtn.disabled = !(nombreValido && apellidoValido && telefonoValido);
        }

        nombreInput.addEventListener('blur', verificarFormularioContacto);
        apellidoInput.addEventListener('blur', verificarFormularioContacto);
        telefonoInput.addEventListener('blur', verificarFormularioContacto);

        confirmarDatosBtn.addEventListener('click', () => {
            if (!confirmarDatosBtn.disabled) {
                const datosContacto = {
                    nombre: nombreInput.value,
                    apellido: apellidoInput.value,
                    telefono: telefonoInput.value,
                    email: emailInput.value
                };
                const datosOpcionales = obtenerDatosFormularioOpcional(formularioOpcionalContainer);
                datosContactoGuardados = { ...datosContacto }; // Guardar para el modal
                datosOpcionalesGuardados = { ...datosOpcionales }; // Guardar para el modal
                guardarDatosLocalStorage(tipoSeguro, cobertura, datosContacto);
                guardarDatosSessionStorage(tipoSeguro, cobertura, datosOpcionales);
                mostrarModalResumen(tipoSeguro, cobertura, datosContacto, datosOpcionales);
            } else {
                alert('Por favor, complete los campos requeridos.');
            }
        });
    }

    function cargarFormularioOpcional(tipoSeguro, cobertura, container) {
        container.innerHTML = '';
        const botonOcultar = document.createElement('button');
        botonOcultar.textContent = 'Ocultar información adicional';
        botonOcultar.type = 'button';
        botonOcultar.addEventListener('click', () => {
            container.style.display = 'none';
            container.innerHTML = ''; // Limpiar el contenido al ocultar
            const formularioContacto = document.querySelector('.formulario-contacto');
            if (formularioContacto) {
                formularioContacto.querySelector('#confirmar-datos-btn').disabled = false; // Habilitar el botón al ocultar
            }
        });

        let formularioOpcionalHTML = '';

        switch (tipoSeguro) {
            case 'inmuebles':
                formularioOpcionalHTML += `
                    <h4>Información del Inmueble (Opcional)</h4>
                    <div>
                        <label for="direccion">Dirección:</label>
                        <input type="text" id="direccion" name="direccion">
                    </div>
                    <div>
                        <label for="tipo-inmueble">Tipo:</label>
                        <select id="tipo-inmueble" name="tipo-inmueble">
                            <option value="">Seleccionar</option>
                            <option value="casa">Casa</option>
                            <option value="departamento">Departamento</option>
                            <option value="local">Local Comercial</option>
                            <option value="terreno">Terreno</option>
                        </select>
                    </div>
                `;
                break;
            case 'automovil':
                formularioOpcionalHTML += `
                    <h4>Información del Vehículo (Opcional)</h4>
                    <div>
                        <label for="marca">Marca:</label>
                        <input type="text" id="marca" name="marca">
                    </div>
                    <div>
                        <label for="modelo">Modelo:</label>
                        <input type="text" id="modelo" name="modelo">
                    </div>
                    <div>
                        <label for="anio">Año:</label>
                        <input type="number" id="anio" name="anio">
                    </div>
                `;
                break;
            case 'vida':
                formularioOpcionalHTML += `
                    <h4>Información Adicional (Opcional)</h4>
                    <div>
                        <label for="edad-titular">Edad del Titular:</label>
                        <input type="number" id="edad-titular" name="edad-titular">
                    </div>
                    <div>
                        <label for="beneficiarios">Beneficiarios:</label>
                        <input type="text" id="beneficiarios" name="beneficiarios">
                    </div>
                `;
                break;
            case 'salud':
                formularioOpcionalHTML += `
                    <h4>Información Adicional (Opcional)</h4>
                    <div>
                        <label for="tiene-preexistencias">¿Tiene preexistencias?</label>
                        <select id="tiene-preexistencias" name="tiene-preexistencias">
                            <option value="">Seleccionar</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                `;
                break;
            default:
                formularioOpcionalHTML += '<p>No hay información adicional para cargar.</p>';
                break;
        }

        container.innerHTML = formularioOpcionalHTML;
        container.appendChild(botonOcultar); // Añadir el botón de ocultar al final
    }

    function obtenerDatosFormularioOpcional(container) {
        const datos = {};
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            datos[input.name] = input.value;
        });
        return datos;
    }

    function guardarDatosLocalStorage(tipoSeguro, cobertura, datosContacto) {
        const keyContacto = `contacto_${tipoSeguro}_${cobertura}`;
        localStorage.setItem(keyContacto, JSON.stringify(datosContacto));
        console.log('Datos de contacto guardados en Local Storage:', datosContacto);
    }

    function guardarDatosSessionStorage(tipoSeguro, cobertura, datosOpcionales) {
        const keyOpcional = `opcional_${tipoSeguro}_${cobertura}`;
        sessionStorage.setItem(keyOpcional, JSON.stringify(datosOpcionales));
        console.log('Datos opcionales guardados en Session Storage:', datosOpcionales);
    }

    function mostrarModalResumen(tipoSeguro, cobertura, datosContacto, datosOpcionales) {
        modalTitulo.textContent = `${tipoSeguro} (${new Date().toLocaleString()})`;
        modalDatos.innerHTML = ''; // Limpiar el contenido previo

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

    // Eventos para cerrar el modal
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
        contenedorFormularios.innerHTML = '';
        mostrarFormularioContacto(tipoSeguroSeleccionado, coberturaSeleccionada);
        // Re-llenar los campos con los datos guardados
        const formularioContacto = contenedorFormularios.querySelector('.formulario-contacto');
        if (formularioContacto) {
            formularioContacto.querySelector('#nombre').value = datosContactoGuardados?.nombre || '';
            formularioContacto.querySelector('#apellido').value = datosContactoGuardados?.apellido || '';
            formularioContacto.querySelector('#telefono').value = datosContactoGuardados?.telefono || '';
            formularioContacto.querySelector('#email').value = datosContactoGuardados?.email || '';

            const formularioOpcionalContainer = formularioContacto.querySelector('#formulario-opcional-container');
            if (formularioOpcionalContainer && datosOpcionalesGuardados && Object.keys(datosOpcionalesGuardados).length > 0) {
                formularioOpcionalContainer.style.display = 'block';
                cargarFormularioOpcional(tipoSeguroSeleccionado, coberturaSeleccionada, formularioOpcionalContainer, datosOpcionalesGuardados);
            } else if (formularioOpcionalContainer) {
                formularioOpcionalContainer.style.display = 'none';
            }
            formularioContacto.querySelector('#confirmar-datos-btn').disabled = false; // Re-habilitar el botón
        }
    });

    enviarMailBtn.addEventListener('click', () => {
        const asunto = `Resumen de Solicitud de Seguro - ${tipoSeguroSeleccionado} - ${coberturaSeleccionada} (${new Date().toLocaleString()})`;
        let cuerpo = `Resumen de su solicitud de seguro:\n\n`;
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
        alert('Se abrirá su cliente de correo electrónico con el resumen de la solicitud.');
    });

    enviarWhatsappBtn.addEventListener('click', () => {
        const numeroTelefonoEjemplo = '5491169732701'; // Reemplaza con un número real (con código de país y sin el '+')
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
    });

    cancelarOperacionBtn.addEventListener('click', () => {
        modalResumen.style.display = 'none';
        contenedorFormularios.innerHTML = '';
        if (tarjetaPrincipalActiva) {
            tarjetaPrincipalActiva.classList.remove('active');
            tarjetaPrincipalActiva = null;
        }
        if (contenedorCoberturasActivo) {
            contenedorCoberturasActivo.remove();
            contenedorCoberturasActivo = null;
        }
        tipoSeguroSeleccionado = null;
        coberturaSeleccionada = null;
        datosContactoGuardados = null;
        datosOpcionalesGuardados = null;

        // Opcional: Puedes limpiar también el LocalStorage y SessionStorage si deseas un reinicio completo
        // localStorage.removeItem(`contacto_${tipoSeguroSeleccionado}_${coberturaSeleccionada}`);
        // sessionStorage.removeItem(`opcional_${tipoSeguroSeleccionado}_${coberturaSeleccionada}`);

        console.log('Operación cancelada y ciclo reiniciado.');
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