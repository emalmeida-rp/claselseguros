export function guardarDatosLocalStorage(tipoSeguro, cobertura, datosContacto) {
    const keyContacto = `contacto_${tipoSeguro}_${cobertura}`;
    localStorage.setItem(keyContacto, JSON.stringify(datosContacto));
}

export function guardarDatosSessionStorage(tipoSeguro, cobertura, datosOpcionales) {
    const keyOpcional = `opcional_${tipoSeguro}_${cobertura}`;
    sessionStorage.setItem(keyOpcional, JSON.stringify(datosOpcionales));
}

export function obtenerDatosLocalStorage(tipoSeguro, cobertura) {
    const keyContacto = `contacto_${tipoSeguro}_${cobertura}`;
    const datos = localStorage.getItem(keyContacto);
    return datos ? JSON.parse(datos) : null;
}

export function obtenerDatosSessionStorage(tipoSeguro, cobertura) {
    const keyOpcional = `opcional_${tipoSeguro}_${cobertura}`;
    const datos = sessionStorage.getItem(keyOpcional);
    return datos ? JSON.parse(datos) : null;
}

export function limpiarDatosAlmacenados(tipoSeguro, cobertura) {
    const keyContacto = `contacto_${tipoSeguro}_${cobertura}`;
    const keyOpcional = `opcional_${tipoSeguro}_${cobertura}`;
    localStorage.removeItem(keyContacto);
    sessionStorage.removeItem(keyOpcional);
} 