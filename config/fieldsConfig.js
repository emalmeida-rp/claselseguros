export const camposOpcionalesConfig = {
    inmuebles: [
        { id: 'direccion', label: 'Dirección', type: 'text' },
        { id: 'localidad', label: 'Localidad', type: 'text' }
    ],
    automovil: [
        { id: 'marca', label: 'Marca', type: 'text' },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'año', label: 'Año', type: 'number' },
        { id: 'chasis', label: 'Nro de Chasis', type: 'text' }
    ],
    vida: [
        { id: 'edad-titular', label: 'Edad del Titular', type: 'number' },
        { id: 'beneficiarios', label: 'Beneficiarios', type: 'text' }
    ],
    salud: [
        { 
            id: 'tiene-preexistencias', 
            label: '¿Tiene preexistencias?', 
            type: 'select',
            options: ['', 'si', 'no']
        }
    ]
};

export const camposRequeridos = {
    nombre: {
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        minLength: 2,
        maxLength: 50,
        errorMessages: {
            required: 'Este campo es requerido.',
            minLength: 'Debe tener al menos 2 caracteres.',
            maxLength: 'No debe exceder los 50 caracteres.',
            pattern: 'Solo se permiten letras y espacios.'
        }
    },
    apellido: {
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        minLength: 2,
        maxLength: 50,
        errorMessages: {
            required: 'Este campo es requerido.',
            minLength: 'Debe tener al menos 2 caracteres.',
            maxLength: 'No debe exceder los 50 caracteres.',
            pattern: 'Solo se permiten letras y espacios.'
        }
    },
    telefono: {
        pattern: /^[0-9+\-\s()]{8,15}$/,
        errorMessages: {
            required: 'Este campo es requerido.',
            pattern: 'Ingrese un número de teléfono válido (8-15 dígitos).'
        }
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 100,
        errorMessages: {
            pattern: 'Ingrese un email válido (ejemplo@dominio.com).',
            maxLength: 'El email no debe exceder los 100 caracteres.'
        }
    }
}; 