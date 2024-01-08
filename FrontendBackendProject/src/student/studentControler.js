var studentServices = require('./studentServices');

var createStudentControllerFn = async (req, res) => 
{
    try
    {
    console.log(req.body);
    var status = await studentServices.createStudentDBService(req.body);
    console.log(status);

    if (status) {
        res.send({ "status": true, "message": "Student created successfully" });
    } else {
        res.send({ "status": false, "message": "Error creating user" });
    }
}
catch(err)
{
    console.log(err);
}
}

var loginUserControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await studentServices.loginuserDBService(req.body);
        if (result.status) {
            res.send({ "status": true, "message": result.msg });
        } else {
            res.send({ "status": false, "message": result.msg });
        }

    } catch (error) {
        console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
}

module.exports = { createStudentControllerFn,loginUserControllerFn };