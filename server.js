const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

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

/*Cookies*/
app.use(cookieParser())
app.use(
    session({
       resave: false,
       saveUninitialized: false,
       secret: process.env.COOKIE_SECRET,
       cookie: {
          httpOnly: true,
          secure: false,
       },
    }),
 );
 //! express-session에 의존하므로 뒤에 위치해야 함
 app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
 app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
 // passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.
 

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.status(200).json(
        {
            name:'JWLK',
            type:'4',
            Cookies: req.cookies,
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
app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
})

/** Error **/
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})