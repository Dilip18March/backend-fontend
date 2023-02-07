require('dotenv').config()

const router=require('./routes/routes')

const express = require('express')

const DbConnect = require('./database');

const cors = require('cors');

const corsOption = {
	credentials:true,

	origin: ['http://localhost:3000']

	

};





const app = express();

app.use(cors(corsOption));


const PORT = process.env.PORT || 2000

DbConnect();

app.use(express.json())
app.use(router)

app.get('/',(req, res) => {

	res.send('hello server')
	
})





app.listen(PORT, () => console.log(`Listening at port ${PORT}`));



