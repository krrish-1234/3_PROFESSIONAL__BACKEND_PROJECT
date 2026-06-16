class ApiError extends Error{
    constructor(
        statusCode,
        message ="Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        // calls the constructor of parent class i.e calls constructor of Error
        this.statusCode = statusCode
        this.data = null
        this.message = message 
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}