export const apiResponse = (statusCode, message, data = null) => {
    return {
        statusCode: statusCode,
        message: message || 'Success',
        data: data,
    };
}