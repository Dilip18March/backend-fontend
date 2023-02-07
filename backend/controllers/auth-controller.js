
const OtpService = require('../services/otp-services')

const HashService = require('../services/hash-services');

const userServices = require('../services/user-services');

const tokenServices = require('../services/token-services')

const UserDto =require('../dtos/user-dto')

require('dotenv').config()





class Authcontroller{

	async sendOtp(req, res) {

		//logic

		const { phone } = req.body;

		if (!phone) {

			res.status(400).json({message:'phone field is required'})
			
		}

		const otp = await OtpService.generateOtp();


		//hash

		const tt1 = 1000 * 60 * 2 //for 2min
		
		const expires = Date.now + tt1;

		const data=`${phone}.${otp}.${expires}`

		const hash = HashService.hashOtp(data);

	//send otp
		
		try {

			//await OtpService.sendBySms(phone, otp)
			
			 res.json({
				hash: `${hash}.${expires}`,
					phone,
					otp
				

			})
			
		} catch (err) {
			
			console.log(err);
			res.status(500).json({message:'message sending failed'})
		}


		
		



	}

	async verifyOtp(req, res) {

		//logic

		const { hash, otp, phone } = req.body;

		if (!hash || !otp || !phone) {
			

			res.status(400).json({ message: 'All field are required' })
			

		}

		const [hashedOtp, expires] = hash.split('.');

		if (Date.now > +expires) {
			
			res.status(400).json({ message: 'otp expired !' })
			

		}

		const data = `${phone}.${otp}.${expires}`;

		const isVailed = OtpService.verifyOtp(hashedOtp, data);
		

		if (!isVailed) {
			
			res.status(400).json({ message: 'Otp Invailed' })
			


		}

		let user;
		
		


		try {

			user = await userServices.findUser({ phone })

			if (!user) {

			user = 	await userServices.createUser({ phone })
				
			}
			

			
		} catch (err) {

			res.status(500).json({message:'Db error'})
			

		}

		//Token

		const { accessToken, refreshToken } = tokenServices.generateToken({ _id: user._id, activated: false });
		
		await tokenServices.storeRefreshToken(refreshToken,user._id)

		res.cookie('refreshtoken',refreshToken ,{

			maxAge: 1000 * 60 * 60 * 24 * 10,
			httpOnly: true,

			

		})

		res.cookie('accessToken', accessToken, {

			maxAge: 1000 * 60 * 60 * 24 * 30,

			httpOnly:true,


		})



		const userDto = new UserDto(user)

		res.json({ auth:true , user:userDto})





		

		
	}


}

module.exports = new Authcontroller();
