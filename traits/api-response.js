exports.success = (res, data, code) => {
    return res.status(code).json(data);
}

exports.errors = (res, message, code) => {
    return res.status(code).json({
        error : message
    });
}