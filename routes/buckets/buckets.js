var express = require('express');
var router = express.Router();

var mockData = require('./mock-data');

/* GET users listing. */
router.get('/', function(req, res, next) {
    const { query } = req;

    const offset = !query || !query?.page ? 0 : (query.page - 1) * 10;
    const size = !query || !query?.size ? 10 : query.size;

    const resData = {
        content: mockData.slice(offset, offset + 10),
        offset,
        totalPages: Math.ceil(mockData.length / size),
        totalElements: mockData.length,
    }
    res.send({
        data: resData,
        statusCode: 200,
        statusText: "OK"
    });
});

router.get('/:id', function(req, res, next) {
    const { id } = req.params;
    const bucket = mockData.find((bucket) => bucket.id === +id);

    if (!bucket) {
        res.status(404).send('Bucket not found');
    }
    res.send({
        data: bucket,
        statusCode: 200,
        statusText: "OK"
    });
});

router.post('/', function(req, res, next) {
    try {
        const { nickName } = req.body;
        if (!nickName) {
            throw new Error('Name is required');
        }

        const newBucket = {
            ...req.body,
            id: mockData.length,
            createdAt: new Date().toISOString(),
            createdBy: 'admin',
            modifiedAt: new Date().toISOString(),
            modifiedBy: 'admin',
        };

        mockData.unshift(newBucket);
        setTimeout(() => {
            res.send({
                data: newBucket,
                statusCode: 200,
                statusText: "OK"
            });
        }, 1000);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', function(req, res, next) {
    const { id } = req.params;
    const bucketIndex = mockData.findIndex((bucket) => bucket.id === +id);
    if (bucketIndex === -1) {
        res.status(404).send('Bucket not found');
    }
    const updatedBucket = {
        ...mockData[bucketIndex],
        ...req.body,
        modifiedAt: new Date().toISOString(),
        modifiedBy: 'admin',
    };
    mockData[bucketIndex] = updatedBucket;
    setTimeout(() => {
        res.send({
            data: updatedBucket,
            statusCode: 200,
            statusText: "OK"
        });
    }, 1000);
});

module.exports = router;
