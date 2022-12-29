const { Router } = require('express');

const router = Router();

router.get('/index', (req, res) => {
	res.json({
		ok: true,
		mensaje: 'proyecto ready',
	});
});

module.exports = router;
