export const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    });
}
