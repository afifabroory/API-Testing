var express = require('express');
var { validate, Joi } = require('express-validation');
const dbPool = require('../db');

var router = express.Router();

const postDocumentValidation = {
    body: Joi.object({
        title: Joi.string().required(),
        contents: Joi.string().required(),
        status: Joi.string()
    })
};

router.post('/', validate(postDocumentValidation, {}, {}), (req, res, next) => {
    var query = dbPool.query('INSERT INTO blog SET ?', req.body, (error, result) => {
        if (error) {
            res.status(500)
               .type('json')
               .json({status: 'Server Error', msg: 'Can\'t insert the data.'})
            throw error
        }

        res.status(201)
           .type('json')
           .json({status: 'Success', msg: 'Uploaded'});
    })

    console.log(query.sql);
});

// TESTING receive data from worker
router.post('/receive', validate(postDocumentValidation, {}, {}), (req, res, next) => {
    var query = dbPool.query('INSERT INTO blog2 SET ?', req.body, (error, result) => {
        if (error) {
            res.status(500)
               .type('json')
               .json({status: 'Server Error', msg: 'Can\'t insert the data.'})
            throw error
        }

        res.status(201)
           .type('json')
           .json({status: 'Success', msg: 'Uploaded'});
    })
});

module.exports = router;