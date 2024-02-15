var express = require('express');
var router = express.Router();

var mockData = require('./mock-data');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.query);
    const { query } = req;
console.log(query)
    const offset = !query || !query?.page ? 0 : (query.page - 1) * 10;
    const size = !query || !query?.size ? 10 : query.size;

    const resData = {
        content: mockData.slice(offset, offset + 10),
        offset,
        totalPages: Math.ceil(mockData.length / size),
        totalElements: mockData.length,
    }
    res.send(resData);
});

router.post('/', function(req, res, next) {
    try {
        const { nickName } = req.body;
        if (!nickName) {
            throw new Error('Name is required');
        }

        mockData.unshift({
            ...req.body,
            id: mockData.length,
            createdAt: new Date().toISOString(),
            createdBy: 'admin',
            modifiedAt: new Date().toISOString(),
            modifiedBy: 'admin',
        });
        setTimeout(() => {
            res.send('Create bucket sucessfully');
        }, 1000);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
