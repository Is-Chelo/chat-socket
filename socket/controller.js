const { Socket } = require('socket.io');
const { validarJWTSocket } = require('../middlewares/validar-jwt');
const ChatMensaje = require('../models/chat-mensajes');

const chatMensaje = new ChatMensaje();

const socketController = async (socket = new Socket(), io) => {
	// TODO: validamos el token
	const usuario = await validarJWTSocket(socket.handshake.headers['x-token']);
	if (!usuario) {
		return socket.disconnect();
	}
	// usuarios activos
	chatMensaje.conectarUsuario(usuario);
	io.emit('usuarios-activos', chatMensaje.usuariosArr);
	socket.emit('recibir-mensajes', chatMensaje.ultimos10);

	//mensaje privados se crea otra sala
	socket.join(usuario.id); // se crea otra sala

	//Limpiamos cuando se desconectan
	socket.on('disconnect', () => {
		chatMensaje.desconectarUsuario(usuario.id);
		io.emit('usuarios-activos', chatMensaje.usuariosArr);
	});

	socket.on('enviar-mensaje', ({ uid, mensaje }) => {
		if (uid) {
			socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje });
		} else {
			chatMensaje.enviarMensaje(usuario.id, usuario.nombre, mensaje);
			io.emit('recibir-mensajes', chatMensaje.ultimos10);
		}
	});
};

module.exports = socketController;


