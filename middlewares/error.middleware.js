const errormiddleware = function (err, req, res, next) {
    try {
        let error = { ...err };
        error.message = err.message
        console.error(err);

        // mongoose bad object id
        if (err.name === 'CastError') {
            error = new Error('Invalid ID format');
            error.statusCode = 400;
        }

        // mongoose duplicated key
        if (err.statusCode === 11000) {
            error = new Error('Duplicated field value entered');
            error.statusCode = 400;
        }

        // validation error
        if (err.name === 'ValidationError') {
            error = new Error(Object.values(err.errors).map(val => val.message).join(', '));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'server error' });

    } catch (error) {
        next(error);
    }
}
export default errormiddleware