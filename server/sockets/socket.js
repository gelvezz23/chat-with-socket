/** @format */

const { io } = require('../server');
const { Usuarios } = require('./../clases/Usuarios');
const { crearMensaje } = require('./../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
	// data que debe llegar nombre por medio de get
	client.on('entrarChat', (data, callback) => {
		if (!data.nombre || !data.sala) {
			return callback({
				mensaje: 'El nombre o la sala no esta asignado',
				error: true,
			});
		}
		client.join(data.sala);
		usuarios.agregarPersona(client.id, data.nombre, data.sala);

		client.broadcast
			.to(data.sala)
			.emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
		callback(usuarios.getPersonasPorSala(data.sala));
	});

	// data que debe llegar {nombre: 'carlos', mensaje:'Hola !! '}
	client.on('crearMensaje', (data) => {
		let persona = usuarios.getPersona(client.id);

		let mensaje = crearMensaje(persona.nombre, data.mensaje);
		client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
	});

	client.on('disconnect', () => {
		let personaBorrada = usuarios.borrarPersona(client.id);
		client.broadcast
			.to(personaBorrada.sala)
			.emit(
				'crearMensaje',
				crearMensaje('chat bot', `${personaBorrada.nombre} se desconecto`)
			);

		client.broadcast
			.to(personaBorrada.sala)
			.emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
	});

	// Mensajes privados datos que deben llegar{ mensaje:'Hola !! ', para: 'client.id'}
	client.on('mensajePrivado', (data) => {
		let persona = usuarios.getPersona(client.id);
		client.broadcast
			.to(data.para)
			.emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
	});
});
