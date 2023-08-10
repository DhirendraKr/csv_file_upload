var exports = module.exports;

exports.handleResponse = ({res, statusCode = 200, msg = "Success", data = {}, result = 1})=>{
    res.status(statusCode).json({status: statusCode, result:result, message: msg, data:data})
}

exports.handleError = ({res, statusCode = 500, err = "Error", data = {}, result = 0})=>{
    res.status(statusCode).json({status: statusCode, result:result, message: err.toString(), data:data})
}






