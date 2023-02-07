const User = require('../models/user-model')

class UserServices{

	async findUser(filter) {
		
		const user = await User.findOne(filter);


		return user;


	}

	async createUser(data) {

		const user = await User.create(data)
		
		return user;
		
		

	}



}

module.exports = new UserServices();
