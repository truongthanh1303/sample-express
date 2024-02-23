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

router.get('/:id', function(req, res, next) {
    const { id } = req.params;
    const smsInfo = mockData.find((smsInfo) => smsInfo.id === +id);

    if (!smsInfo) {
        res.status(404).send('SmsInfo not found');
    }
    res.send(smsInfo);
});

router.post('/', function(req, res, next) {
    try {
        const { name } = req.body;
        if (!name) {
            throw new Error('Name is required');
        }

        const newSmsInfo = {
            ...req.body,
            id: mockData.length,
            createdAt: new Date().toISOString(),
            createdBy: 'admin',
            modifiedAt: new Date().toISOString(),
            modifiedBy: 'admin',
        };

        mockData.unshift(newSmsInfo);
        setTimeout(() => {
            res.send(newSmsInfo);
        }, 1000);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', function(req, res, next) {
    const { id } = req.params;
    const smsInfoIndex = mockData.findIndex((smsInfo) => smsInfo.id === +id);
    if (smsInfoIndex === -1) {
        res.status(404).send('SmsInfo not found');
    }
    const updatedSmsInfo = {
        ...mockData[smsInfoIndex],
        ...req.body,
        modifiedAt: new Date().toISOString(),
        modifiedBy: 'admin',
    };
    mockData[smsInfoIndex] = updatedSmsInfo;
    setTimeout(() => {
        res.send(updatedSmsInfo);
    }, 1000);
});

module.exports = router;
