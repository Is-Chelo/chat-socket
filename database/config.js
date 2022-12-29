const mongoose = require('mongoose');

const dbConnection = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://chelito:QI2xrbdnbeW2nxZN@cluster0.knpi66t.mongodb.net/test',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			}
		);

		console.log('Base de datos online');
	} catch (error) {
		console.log(error);
		throw new Error('Error a la hora de iniciar la base de datos');
	}
};

module.exports = {
	dbConnection,
};
