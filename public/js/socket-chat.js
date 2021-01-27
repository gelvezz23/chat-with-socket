/** @format */

var socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('Es necesario que tenga un nombre y una sala');
}

let Usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala'),
};

socket.on('connect', function () {
	console.log('Conectado al servidor');

	socket.emit('entrarChat', Usuario, (res) => {
		console.log('usuario conectado', res);
	});
});

// escuchar
socket.on('disconnect', function () {
	console.log('Perdimos conexión con el servidor');
});

// Enviar información
// socket.emit(
// 	'enviarMensaje',
// 	{
// 		usuario: 'Carlos',
// 		mensaje: 'Hola Mundo',
// 	},
// 	function (resp) {
// 		console.log('respuesta server: ', resp);
// 	}
// );

// Escuchar información
socket.on('crearMensaje', (mensaje) => {
	console.log('Servidor:', mensaje);
});

// Escuchar cuando un usuario entra o sale de el chat
socket.on('listaPersonas', (personas) => {
	console.log(personas);
});

// Enviar un mensaje privado
socket.on('mensajePrivado', (mensaje) => {
	console.log('Mensaje privado : ', mensaje);
});
