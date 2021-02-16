const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//SECTION  collection and schema for Registration
let UserSchema = new Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    birthdate: {
        type: String
    },
    age: {
        type: Number
    },
    marital_status: {
        type: String
    },
    caste: {
        type: String
    },
    add_qualification: {
        type: String
    },
    edu_qualification: {
        type: String
    },
    experience: {
        type: String
    },
    contact: {
        type: String
    },
    email: {
        type: String
    },
    emp_status: {
        type: String
    },
    file_num: {
        type: String
    },
    // emp_reg_no: {
    //     type: String
    // },
    // res_cert: {
    //     type: String
    // },
    pan_name: {
        type: String
    },
    pan_ward: {
        type: String
    }
}, {
    collection: 'User'
});

module.exports = mongoose.model('User', UserSchema);
