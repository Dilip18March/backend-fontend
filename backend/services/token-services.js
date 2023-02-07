
const refreshModel=require('../models/refresh-module')
const jwt = require('jsonwebtoken');

const accessTokensecreat = process.env.JWT_ACCESS_TOKEN;

const refreshtokensecreat = process.env.JWT_REFRESH_TOKEN;



class TokenServices{

	generateToken(payload) {

		const accessToken = jwt.sign(payload, accessTokensecreat, {
			expiresIn: '1h'
			
		})

		const refreshToken = jwt.sign(payload, refreshtokensecreat, {
			expiresIn: '1d'
			
		});

		return { accessToken, refreshToken };


		




	}
	
	async storeRefreshToken(token, userId) {

		try {
			await refreshModel.create({
					
				token,

				userId

				
			})
			
		} catch (err) {
			console.log(err);
			
		}
		


	}
	

}

module.exports = new TokenServices();
