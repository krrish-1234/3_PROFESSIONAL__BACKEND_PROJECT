// Higher Order function means the function which takes function as input and returns a function as output

/*const asyncHandler =(fn)=>{
    return ()=>{}
}

It is same as the above because arrow function have a implicit return 

const asyncHandler =(fn)=>{
    ()=>{}
}

const asyncHandler =(fn)=> ()=>{}
*/

const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err)=> next(err))
        // next(err) passes error to Express error middleware.
    }
}

// const asyncHandler =(fn)=> async (req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500 ).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export {asyncHandler}