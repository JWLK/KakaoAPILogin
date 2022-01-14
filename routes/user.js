const express =require('express')
const router = express.Router()
const pool =require('../helpers/database')
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')
const e = require('express')


router.get('/', async function(req, res) {
    try {
        res.status(200).json('/user')
        
    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
    
});

router.post('/', async function(req, res) {
    try {
        const {code, name} = req.body

        // const sqlQuery = 'CALL setWorker(?,?,?,?)' 
        // const sqlQuery = 'INSERT INTO food_category(code, name) value (?,?)'
        // const result = await pool.query(sqlQuery, [code, name])
        // res.status(200).json({"result": "1"})

        res.status(200).json({code: name})

    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
});


router.get('/search', async function(req, res) {
    try {
        var name = req.query.name
        if(name == null){
            const sqlQuery = 'SELECT * FROM user_list'
            const rows = await pool.query(sqlQuery)
            res.status(200).json(rows)
        } else {
            const sqlQuery = 'SELECT * FROM user_list WHERE name = ?'
            const rows = await pool.query(sqlQuery, name)
            res.status(200).json(rows)
        }
        
    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
    
});

router.post('/regist/manager', async function(req, res) {
    try {
        const {email, password} = req.body

        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)
        // const encryptedPassword = await bcrypt.hash(password, 10)

        const sqlQuery = 'INSERT INTO user (email, password) VALUES (?,?)'
        const result = await pool.query(sqlQuery, [email, encryptedPassword])

        res.status(200).json({"result": "1"})
        // res.status(200).json({User_Idx: salt})
        
    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
});


router.post('/login', async function(req, res) {
    try {
        const {idx, password} = req.body;
        
        const sqlGetUser = 'SELECT password FROM user WHERE idx=?'
        const rows = await pool.query(sqlGetUser, idx)
        if(rows) {
            const isValid = await bcrypt.compare(password, rows[0].password)
            res.status(200).json({valid_pssword: isValid})
        }
        // res.status(200).send(`User widh id ${idx} was not found`)

    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
});



module.exports = router