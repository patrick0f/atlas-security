const {CustomAPIError} = require("../errors/custom-error");
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({msg: err.message});
    }
    const statusCode = err.status || err.statusCode || 500;
    
return res.status(statusCode).json({msg:err.message, statusCode:err.status});
}

module.exports = errorHandlerMiddleware