const asyncHandler = require('express-async-handler');

exports.text = asyncHandler(async (req,res,next) => {
    next()
})
/*
    TODO: INPUT THE REST HERE 
*/