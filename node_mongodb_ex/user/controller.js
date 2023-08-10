const multer = require('multer');
const {Readable} = require('stream');
const csv = require('csv-parser');
const connectDB = require('./../config/connection_db')
const {handleResponse, handleError} = require("../helper/index");
const upload = multer().single('file');


exports.uploadFiles = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                handleError({res, statusCode: 500, err: err})
            } else if (err) {
                handleError({res, statusCode: 500, err: err})
            } else if (req.file.mimetype != 'text/csv') {
                handleError({res, statusCode: 400, err: "Invalid file type. Only CSV files are allowed."})
            }

            const collection = await connectDB();
            const csvFilePath = req.file.buffer;
            const stream = Readable.from(csvFilePath);
            stream.pipe(csv()).on("data", async (data) => {
                await collection.insertOne(data)
            }).on('end', async () => {
                handleResponse({res, data: {}})
            }).on('error', (error) => {
                handleError({res, statusCode: 400, err: err})
            });
        });
    } catch (error) {
        handleError({res, statusCode: 500, err: err})
    }
};

exports.getData = async (req, res) => {
    try {
        const collection = await connectDB();
        let result = await collection.find({}).toArray();
        handleResponse({res, data: result})
    } catch
        (error) {
        handleError({res, statusCode: 500, err: err})
    }
}


exports.deleteAllData = async (req, res) => {
    try {
        const collection = await connectDB();
        const deleteResult = await collection.deleteMany({});
        handleResponse({res, data: deleteResult})
    } catch
        (error) {
        handleError({res, statusCode: 500, err: err})
    }
}
