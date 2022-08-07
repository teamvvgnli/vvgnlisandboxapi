exports.validateFileUploadRequest = (req) => {
    console.log("files -> ", req.files);

    if(req.files.length === 0){
        return {
            message: "please upload a file",
            success: false,
        };
    }

    req.files.forEach(function (file) {
        if(file.mimetype.split("/")[0] !== 'image' ||
        file.mimetype.split("/")[0] !== 'video'){
            return {
                message: "invalid file type",
                success: false,
            };
        }
    });

    return {
        message: "validated successfully",
        success: true,
    };
}