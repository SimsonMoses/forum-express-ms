
/**
    Error handler middleware is used to catch any error that occurs in the application.
**/
export const errorHandler = (err,req,res,next)=>{
    console.error(err);
    console.log(`Error in error handler: ${err.name}`);
    let message;
    let stackTrace;
    switch(err.name){
        case 'SequelizeUniqueConstraintError':
            res.status(400)
            message= err.errors[0].message,
            stackTrace= process.env.NODE_ENV === 'production' ? '' : err;
            break;
        case 'Error':
            message= err.message,
            stackTrace= process.env.NODE_ENV === 'production' ? '' : err;
            break;
        case 'TokenExpiredError':
            res.status(401);
            message = 'token expired';
            break;
        default:
            res.status(500)
            message= err.message || 'Something went wrong';
            break;
    }

    return res.json({
        message,
        stackTrace
    })
}