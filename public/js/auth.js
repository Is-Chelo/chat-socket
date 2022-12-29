// Referencias HTML
const miform = document.querySelector('form');

const url = window.location.hostname.includes('localhost')
	? 'http://localhost:3000/api/auth'
	: 'https://chat-socket-production-7f3f.up.railway.app/api/auth';

function handleCredentialResponse(response) {
	console.log('Encoded JWT ID token: ' + response.credential);
	const data = { id_token: response.credential };
	fetch(url + '/google', {
		mode: 'no-cors',
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
		.then((resp) => resp.json())
		.then((data) => {
			console.log(data);
			localStorage.setItem('token', data.token);
			localStorage.setItem('email', data.usuario.correo);
		})
		.catch(console.log);
}

window.onload = function () {
	google.accounts.id.initialize({
		client_id: '591948256338-umddetebmj0mcvjkeo9em9io9sdber68.apps.googleusercontent.com',
		callback: handleCredentialResponse,
	});
	google.accounts.id.renderButton(
		document.getElementById('buttonDiv'),
		{ theme: 'outline', size: 'large' } // customization attributes
	);
	google.accounts.id.prompt(); // also display the One Tap dialog
};

function signOut() {
	console.log(google.accounts.id);
	const email = localStorage.getItem('email');
	google.accounts.id.revoke(email, (done) => {
		console.log('consent revoked');
		localStorage.clear();
		window.location.reload();
	});
}

miform.addEventListener('submit', (e) => {

	e.preventDefault();
	const formData = {};
	for (let el of miform.elements) {
		if (el.name.length > 0) {
			formData[el.name] = el.value;
		}
	}
	console.log(formData);
	fetch(url + '/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData),
	})
		.then((resp) => resp.json())
		.then((data) => {
			console.log(data);
			localStorage.setItem('token', data.token);
			window.location='chat.html'
		})
		.catch(console.log);
});
