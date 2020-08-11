const mongoose = require('mongoose');

const FormResponseSchema = new mongoose.Schema({
    form_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'form'
    },
    submitted_at :{
        type : Date,
        default: Date.now
    },
    meta : {
        type : mongoose.Schema.Types.Mixed,
        required: true
    },
    response:{
        type : mongoose.Schema.Types.Mixed,
        required: true
    },

})

module.exports = FormResponse = mongoose.model('form_response', FormResponseSchema);