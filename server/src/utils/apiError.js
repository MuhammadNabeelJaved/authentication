class ApiError extends Error {
    constructor(message, statusCode, stack, errors) {
        super(message);
        this.statusCode = statusCode,
            this.message = message || "Something went wrong";
        this.stack = stack || null;
        this.errors = errors || null;
        this.data = null;
        this.success = false;
        this.name = this.constructor.name;
        if (stack) {
            this.stack = stack;
        }
        else {
            this.stack = Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;