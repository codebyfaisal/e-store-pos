const responseError = (res, code, message) =>
    res.status(code).json({ success: false, error: message });

const responseSuccess = (res, code, result, message) =>
    res.status(code).json({ success: true, result, message });

export { responseError, responseSuccess };