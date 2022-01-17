const express =require('express')
const router = express.Router()
const pool =require('../helpers/database')
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')


router.get('/', async (req, res) => {
    try {
        res.status(200).json('/user')
        
    } catch (error) {
        res.status(400).json({"code": "400", "error": error})
    }
    
});

router.post('/', async (req, res) => {
    try {
        const {code, name} = req.body

        // const sqlQuery = 'CALL setWorker(?,?,?,?)' 
        // const sqlQuery = 'INSERT INTO food_category(code, name) value (?,?)'
        // const result = await pool.query(sqlQuery, [code, name])
        // res.status(200).json({"result": "1"})

        res.status(200).json({code: name})

    } catch (error) {
        res.status(400).json({"code": "400", "error": error})
    }
});


router.get('/search', async (req, res) => {
    try {
        var email = req.query.email
        if(email == null){
            const sqlQuery = 'SELECT * FROM user_list'
            const rows = await pool.query(sqlQuery)
            res.status(200).json({"code": "200", "desc": "Success " , "result": rows})
        } else {
            const sqlQuery = 'SELECT * FROM user_list WHERE email = ?'
            const rows = await pool.query(sqlQuery, email)
            res.status(201).json({"code": "201", "desc": "Success " , "result": rows})
        }
        
    } catch (error) {
        res.status(400).json({"code": "400", "error": error})
    }
    
});

router.post('/signup', async (req, res) => {
    try {
        const {email, password} = req.body
        const uuid = v4()

        const sqlQuery_UserCheck = 'SELECT * FROM user_list WHERE email = ?'
        const exUser = await pool.query(sqlQuery_UserCheck, email)
        if (exUser[0]) {
            res.status(500).json({"code": "500", "desc": "Email already signup.", "result" : exUser[0].email})
        } else {
            const salt = await bcrypt.genSalt(10)
            const encryptedPassword = await bcrypt.hash(password, salt)
            // const encryptedPassword = await bcrypt.hash(password, 10)
    
            const sqlQuery = 'call setUser(?, ?, ?)'
            const result = await pool.query(sqlQuery, [uuid, email, encryptedPassword])

            res.status(200).json({"code": "200", "desc": "Success ", "result": result})
            // res.status(200).json({User_Idx: salt})
        }
    } catch (error) {
        res.status(400).json({"code": "400", "error": error})
    }
});


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const sqlGetUser = 'SELECT password FROM user_list WHERE email = ?'
        const rows = await pool.query(sqlGetUser, email)
        // res.status(200).json({"code": "200", "desc": "Login Succeed", "result" : rows})
        if(rows) {
            const isValid = await bcrypt.compare(password, rows[0].password)
            res.status(200).json({"code": "200", "desc": "Login Succeed", "result" : isValid})
        } else {
            res.status(500).json({"code": "500", "desc": "Eamil was not founded", "result" : rows[0]})
        }

    } catch (error) {
        res.status(400).json({"code": "400", "error": error})
    }
});



module.exports = router