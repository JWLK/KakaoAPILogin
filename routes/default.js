const express =require('express')
const router = express.Router()
const pool =require('../helpers/database')

const routeName = 'default'

router.get('/', async function(req, res) {
    try {
        var name = req.query.name

        if(name == null){
            res.status(200).json(`/${routeName} : single`)
        } else {
            res.status(200).json(`/${routeName} : ` + name )
        }
        
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

        res.status(200).json({code: code, name: name})

    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
});

router.patch('/', async function(req, res) {
    try {
        var jsonData = req.body.map((data, index) => {
            var mark_index = `mark_${index}`
            var code_index = `code_${index}`
            var name_index = `name_${index}`
            var object_index = `object_${index}`
            const {code, name, object} = data
            // console.log(`{ ${code_index} : ${code} , ${name_index} : ${name} }`)
            // var obj = JSON.parse(`{ "${code_index}" : "${code}" , "${name_index}" : "${name}" }`)
            var obj = JSON.parse(`{ 
                "${code_index}" : "${code}" , 
                "${name_index}" : "${name}" , 
                "${object_index}" : "${ (object == null) ? 'null' : 'Element Exist'}" 
            }`)

            return obj
        })
        console.log(jsonData) 
        // const sqlQuery = 'CALL setWorker(?,?,?,?)' 
        // const sqlQuery = 'INSERT INTO food_category(code, name) value (?,?)'
        // const result = await pool.query(sqlQuery, [code, name])
        // res.status(200).json({"result": "1"})

        res.status(200).json(jsonData)

    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
});

router.delete('/', async function(req, res) {
    const idx = parseInt(req.query.idx, 10)
    if(!idx) {
        return res.status(400).json({"result": "0", "error": error})
    }

    try {
        res.status(200).json({idx: idx})
        
    } catch (error) {
        res.status(400).json({"result": "0", "error": error})
    }
});


/**
 * End-Point
 */



module.exports = router