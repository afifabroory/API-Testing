const mysql = require('mysql');
const dotenv = require('dotenv');
const request = require('request');

dotenv.config()

const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Proses POST request secara asynchronous
const sendPostRequest = async function(data) {
    let url = process.env.POST_DEST + '/document/receive';
    await request.post(url, function (error, response, body) {
        if (error !== null) {
            return
        }

        switch(response.statusCode) {
            case 404:
                console.log(`Can\'t acccess endpoint ${url}`)
                console.log('statusCode:', response && response.statusCode); 
                break;
            case 400:
                console.log('body:', body); 
                break;
        }
    }).json(data);
}

const processDocument = function() {
    connectionPool.query('SELECT title, contents FROM blog WHERE status = \'DRAFT\'', (err, result) => {
        if (result.length > 0) {
            updateDocumentStatus();
            result.forEach((value) => {
                if (typeof value !== 'undefined') {
                    sendPostRequest({
                        'title': value.title,
                        'contents': value.contents,
                        'status': 'PUBLISHED'
                    })
                }
            });
        } else {
            console.log('No update so far.');
        }
    });
}

const updateDocumentStatus = function() {
    connectionPool.query('UPDATE blog SET status = \'PUBLISHED\' WHERE status = \'DRAFT\'', (err, result) => {
        console.log(`Number of posts updated: ${result.affectedRows}`);
    });
}

setInterval(() => {
    processDocument();
}, 3500);
