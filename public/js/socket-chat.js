// Referencias HTML

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensaje = document.querySelector('#ulMensaje');
const btnSalir = document.querySelector('#btnSalir');

let usuario = null;
let socket = null;

const url = window.location.hostname.includes('localhost')
	? 'http://localhost:3000/api/auth'
	: 'https://restserver-curso-fher.herokuapp.com/api/auth';

const validarJWT = async () => {
	const token = localStorage.getItem('token') || '';
	if (token.length < 10) {
		window.location = 'index.html';
		throw new Error('No hay token en el servidor...');
	}
	const resp = await fetch(url, {
		mode: 'no-cors',
		headers: { 'x-token': token },
	});
	const { usuario: userDb, token: tokenDb } = await resp.json();

	localStorage.setItem('token', tokenDb);

	await conectarSocket(tokenDb);
};

const conectarSocket = async (token) => {
	socket = io({
		extraHeaders: {
			'x-token': token,
		},
	});
	socket.on('connect', () => {
		console.log('Socket online');
	});
	socket.on('disconnect', () => {
		console.log('Socket offline');
	});
	socket.on('recibir-mensajes', (payload) => {
		console.log(payload);
		dibujarMensajes(payload);
	});
	socket.on('usuarios-activos', (payload) => {
		// console.log(payload);
		dibujarUsuarios(payload);
	});

	socket.on('mensaje-privado', (payload) => {
		console.log(payload);
	});
};

const dibujarUsuarios = (usuarios = []) => {
	let userHtml = ``;
	usuarios.forEach((usuario) => {
		userHtml += `<li>
                    <p><h5 class="m-0 text-info">${usuario.nombre}</h5></p><span class="text-secondary">${usuario.uid}</span>
            </li>`;
	});
	ulUsuarios.innerHTML = userHtml;
};

const dibujarMensajes = (mensajes = []) => {
	let mensajeHtml = ``;
	mensajes.forEach(({ nombre, mensaje }) => {
		mensajeHtml += `<li class="bg-info-subtle">
                            <p class="m-0 text-info">${nombre}  <span class="text-secondary">${mensaje}</span> </p>
                           
                        </li>`;
	});
	ulMensaje.innerHTML = mensajeHtml;
};

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
	const mensaje = txtMensaje.value;
	const uid = txtUid.value;
	if (keyCode !== 13) {
		return;
	}
	if (mensaje.length === 0) {
		return;
	}
	socket.emit('enviar-mensaje', { mensaje, uid });
});

const main = async () => {
	await validarJWT();
};

main();
