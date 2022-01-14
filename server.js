const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config({path: '.env-local'})

const app = express()
const PORT = process.env.PORT || '3001'

/**
 * Cors : Cross Origin Resource Sharing
 */
let corsOption = {
    origin: 'http://localhost:3080', // 허락하는 요청 주소
    credentials: true // true로 하면 설정한 내용을 response 헤더에 추가됨.
} 
app.use(cors(corsOption));

/**
 * Middleware
 */
app.use(express.json())
app.use(express.urlencoded({extended:false}))

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.status(200).json(
        {
            name:'JWLK',
            type:'4',
        }
    )
})


/** Default **/
const defaultRouter = require('./routes/default')
app.use('/default', defaultRouter)

/** Auth **/
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

/** User **/
const userRouter = require('./routes/user')
app.use('/user', userRouter)

/** 
 * 
 * Start listening 
 * 
 */
app.listen(PORT, () => {
    console.log(`Listening for requests on PROT ${PORT}`)
})

/** 404 **/
app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
})

/** Error **/
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})