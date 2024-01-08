const studentModel = require('./studentModel');
var key='123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);

const createStudentDBService = async (studentDetails) => {
    try {
        const encryptedPassword = encryptor.encrypt(studentDetails.password);

        const studentModelData = new studentModel({
            firstname: studentDetails.firstname,
            lastname: studentDetails.lastname,
            email: studentDetails.email,
            password: encryptedPassword,
        });

        await studentModelData.save();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const loginuserDBService = async (studentDetails) => {
    try {
        const result = await studentModel.findOne({ email: studentDetails.email });

        if (!result) {
            throw { status: false, msg: "Invalid Data" };
        }

        const decrypted = encryptor.decrypt(result.password);

        if (decrypted === studentDetails.password) {
            return { status: true, msg: "Student Validated Successfully" };
        } else {
            throw { status: false, msg: "Student Validation Failed" };
        }
    } catch (error) {
        console.error(error);
        throw { status: false, msg: "Error during student validation" };
    }
};

module.exports = { createStudentDBService, loginuserDBService };
