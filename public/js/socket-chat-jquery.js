/** @format */

var params = new URLSearchParams(window.location.search);
let divUsuario = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');

var sala = params.get('sala');
var usuario = params.get('nombre');

// funciones para render de usuarios
const renderizarUsuarios = (personas) => {
	// referencias de html

	console.log(personas);
	var html = '';
	html += '<li>';
	html += '<a href="javascript:void(0)" class="active">';
	html += 'Chat de <span> ' + params.get('sala') + '</span></a>';
	html += '</li>';

	for (var i = 0; i < personas.length; i++) {
		html += '<li>';
		html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)">';
		html += '<img src="assets/images/users/1.jpg" alt="user-img" class="img-circle" />';
		html +=
			'<span>' +
			personas[i].nombre +
			' <small class="text-success">online</small></span>';
		html += '</a>';
		html += '</li>';
	}
	divUsuario.html(html);
};

const renderizarMensaje = (mensaje, yo) => {
	var html = '';
	var fecha = new Date(mensaje.fecha);
	var hora = fecha.getHours() + ':' + fecha.getMinutes();

	var adminClass = 'bg-light-info';
	if (mensaje.nombre === 'chat bot') {
		adminClass = '';
	}

	if (yo) {
		html += '<li class="reverse">';
		html += '<div class="chat-content">';
		html += '<h5>' + mensaje.nombre + '</h5>';
		html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
		html += '</div>';
		html += '<div class="chat-img">';
		html += '<img src="assets/images/users/5.jpg" alt="user" />';
		html += '</div>';
		html += '<div class="chat-time">' + hora + '</div>';
		html += '</li>';
	} else {
		html += '<li class="animated fadeIn">';
		html += '<div class="chat-img">';
		if (mensaje.nombre !== 'chat bot') {
			html += '<img src="assets/images/users/1.jpg" alt="user" />';
		}
		html += '</div>';
		html += '<div class="chat-content">';
		html += '<h5>' + mensaje.nombre + '</h5>';
		html += '<div class="box ' + adminClass + '">' + mensaje.mensaje + '</div>';
		html += '</div>';
		html += '<div class="chat-time">' + hora + '</div>';
		html += '</li>';
	}

	divChatbox.append(html);
};

const scrollBottom = () => {
	// selectors
	var newMessage = divChatbox.children('li:last-child');

	// heights
	var clientHeight = divChatbox.prop('clientHeight');
	var scrollTop = divChatbox.prop('scrollTop');
	var scrollHeight = divChatbox.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		divChatbox.scrollTop(scrollHeight);
	}
};

//Listerners -
divUsuario.on('click', 'a', function () {
	var id = $(this).data('id');

	if (id) {
		console.log(id);
	}
});

formEnviar.on('submit', (event) => {
	event.preventDefault();
	if (txtMensaje.val().trim().length === 0) {
		return;
	}

	socket.emit(
		'crearMensaje',
		{
			nombre: usuario,
			mensaje: txtMensaje.val(),
		},
		function (mensaje) {
			txtMensaje.val('').focus();
			renderizarMensaje(mensaje, true);
			scrollBottom();
		}
	);
});
