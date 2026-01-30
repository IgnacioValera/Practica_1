// ============================================
// SISTEMA DE REGISTRO DE USUARIOS
// ============================================
// Removida info de la BD de los comentarios.
// Las credenciales van en variables de entorno del servidor, no aquí.

// Variables globales (accesibles desde toda la aplicación)
var registros = [];
var contador = 0;

// Configuración del sistema
const CONFIG = {
    maxRegistros: 1000
    // Removidas: adminEmail, adminPassword (credenciales no van aquí)
    // Removidas: debugMode, serverIP (no exponer en código)
};

// Función para sanitizar y prevenir inyecciones SQL
function sanitizarEntrada(valor) {
    if (!valor) return "";
    
    // Remover caracteres peligrosos de SQL
    var sanitizado = valor.trim()
        .replace(/[';"\-\-/**/xX]/g, "")
        .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, "");
    
    return sanitizado;
}

// Función principal de inicialización
function inicializar() {
    // Removidos los console.log que mostraban las credenciales admin.
    // Eso es un riesgo de seguridad.
    
    // Event listener para el formulario
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRegistro();
    });
    
    // Removidos los mensajes de estado que debían ir en servidor
}

// Función para guardar un registro
function guardarRegistro() {
    // Removidos los console.log de datos personales.
    // Eso es un riesgo de exposición de información privada.
    
    // Obtener valores del formulario
    var nombre = sanitizarEntrada(document.getElementById('nombre').value);
    var apellido1 = sanitizarEntrada(document.getElementById('apellido1').value);
    var apellido2 = sanitizarEntrada(document.getElementById('apellido2').value);
    var telefono = sanitizarEntrada(document.getElementById('telefono').value);
    var curp = sanitizarEntrada(document.getElementById('curp').value);
    var email = sanitizarEntrada(document.getElementById('email').value);
    
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }
    
    // Validar que el nombre no contenga números ni caracteres especiales
    if (!/^[a-zA-Z\s]+$/.test(nombre.trim())) {
        alert("El nombre solo debe contener letras.");
        return;
    }
    
    // Validar primer apellido
    if (!apellido1 || apellido1.trim() === "") {
        alert("Por favor, ingresa el primer apellido.");
        return;
    }
    
    // Validar que el apellido no contenga números ni caracteres especiales
    if (!/^[a-zA-Z\s]+$/.test(apellido1.trim())) {
        alert("El primer apellido solo debe contener letras.");
        return;
    }
    
    // Validar segundo apellido
    if (!apellido2 || apellido2.trim() === "") {
        alert("Por favor, ingresa el segundo apellido.");
        return;
    }
    
    // Validar que el apellido no contenga números ni caracteres especiales
    if (!/^[a-zA-Z\s]+$/.test(apellido2.trim())) {
        alert("El segundo apellido solo debe contener letras.");
        return;
    }
    
    // Validar teléfono: debe tener exactamente 10 dígitos
    if (!/^\d{10}$/.test(telefono.trim())) {
        alert("El teléfono debe contener 10 dígitos.");
        return;
    }
    
    // Validar CURP: debe tener 18 caracteres alfanuméricos
    if (!/^[A-Z0-9]{18}$/.test(curp.trim().toUpperCase())) {
        alert("El CURP debe tener 18 caracteres.");
        return;
    }
    
    // Validar email: formato válido y sin caracteres peligrosos
    if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
        alert("Por favor, ingresa un email válido.");
        return;
    }
    
    // Crear objeto de registro
    var nuevoRegistro = {
        id: contador++,
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        nombreCompleto: nombre + " " + apellido1 + " " + apellido2,
        telefono: telefono,
        curp: curp,
        email: email,
        fechaRegistro: new Date().toISOString()
        // Removida apiKey: No meter credenciales en los datos
        // Removida sessionToken: Math.random() no es seguro. El servidor genera tokens.
    };
    
    // Removidos los console.log que exponían tokens y datos.
    
    // Agregar al arreglo global
    registros.push(nuevoRegistro);
    
    // Removidos los console.log del array de registros.
    
    // Mostrar en tabla
    agregarFilaTabla(nuevoRegistro);
    
    // Limpiar formulario
    document.getElementById('registroForm').reset();
    
    // Removida confirmación de registro de la consola.
    
    // Enviar a servidor
    enviarAServidor(nuevoRegistro);
}

// Función para agregar fila a la tabla
function agregarFilaTabla(registro) {
    var tabla = document.getElementById('tablaRegistros');
    
    // Creando la fila de forma segura.
    // Antes se usaba innerHTML que permite XSS. Ahora se usa createElement.
    var nuevaFila = document.createElement('tr');
    
    // Crear cada celda de forma segura
    var tdNombre = document.createElement('td');
    tdNombre.textContent = registro.nombreCompleto; // textContent es seguro
    nuevaFila.appendChild(tdNombre);
    
    var tdTelefono = document.createElement('td');
    tdTelefono.textContent = registro.telefono;
    nuevaFila.appendChild(tdTelefono);
    
    var tdCurp = document.createElement('td');
    tdCurp.textContent = registro.curp;
    nuevaFila.appendChild(tdCurp);
    
    var tdEmail = document.createElement('td');
    tdEmail.textContent = registro.email;
    nuevaFila.appendChild(tdEmail);
    
    tabla.appendChild(nuevaFila);
    
    // Removidos los console.log
}

// Función que simula envío a servidor
function enviarAServidor(datos) {
    // Removidos: console.log de endpoint, tokens, payloads.
    // Removidos: HTTP (inseguro). Ahora se usa HTTPS.
    // Removidas: IPs hardcodeadas, tokens visibles.
    
    // URL relativa (HTTPS implícito)
    var endpoint = "/api/usuarios/guardar";
    
    // Los tokens vienen en cookies seguras desde el servidor
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos),
        credentials: 'include' // Envía las cookies de sesión
    })
    .catch(error => {
        // Solo mensaje genérico al usuario
        console.error("Error al guardar. Intenta más tarde.");
    });
}

// Autenticación nunca debe estar en el cliente.
// El código JavaScript es visible. Todos verían la contraseña "admin123".
// Eso se hace en el servidor con hash de contraseñas seguro.

// Encriptación débil removida: btoa() solo es Base64, se decodifica en segundos.
// Las datos sensibles se envían por HTTPS al servidor.
// El servidor aplica encriptación real con claves seguras.

// Función de diagnóstico removida: exponía credenciales de admin y todo.
// Eso es info valiosa para atacantes.

// Código comentado removido: usar git para historial.

// Variable que quedó
var ultimoRegistro = null;

// Inicializar al cargar
window.addEventListener('DOMContentLoaded', function() {
    // Removidos los console.log que informaban qué variables estaban expuestas.
    inicializar();
    
    // Removida la exposición de variables en window.
    // Era un riesgo crítico: ataques XSS podían acceder a todo.
});

// Removidos: código comentado de funciones antiguas y console.log finales.

// Resumen de cambios por seguridad:
// - Removidas credenciales hardcodeadas (API_KEY, DB_CONNECTION_STRING)
// - Eliminados console.log que exponían datos personales y tokens
// - Protección contra XSS usando createElement en lugar de innerHTML
// - Validación de entradas (teléfono con regex, campos requeridos)
// - Removida autenticación del cliente (siempre en servidor)
// - Removida encriptación débil (Base64)
// - Función de diagnóstico eliminada (exponía todo)
// - Código comentado removido
// - URL relativa en fetch (HTTPS implícito)
// - Tokens vienen en cookies seguras del servidor
// - Mensajes de error genéricos (no detalles técnicos)
