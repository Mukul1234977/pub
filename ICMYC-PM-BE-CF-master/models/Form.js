const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    title:{
        type : [mongoose.Schema.Types.Mixed],
        required: true
    },
    description:{
        type : [mongoose.Schema.Types.Mixed],
        required: false
    },
    role:[
        {
            value:{
                type: String,
                required: true
            }
        }
    ],
    type: [
        {
            value:{
                type: String,
                required: false
            }
        }
    ],
    state:[
        {
            value:{
                type: String,
                required: false
            }
        }
    ],
    city:[
        {

            value:{
                type: String,
                required: false
            }
        }
    ],
    civic_agency:[
        {
            id: {
                type : String,
                required: false
            },
            value:{
                type: String,
                required: false
            }
        }
    ],
    action:[
        {

            value:{
                type: String,
                required: false
            }
        }
    ],
    categories:[
        {
            value:{
                type: String,
                required: false
            }
        }
    ],
    created_at:{
        type: Date,
        default : Date.now
    },

    order:{
        type: Number,
        required:true
    },

    fields: [
        {
            field_title:{
                type : [mongoose.Schema.Types.Mixed],
                required: true
            },
            name:{
                type : String,
                required: true
            },
            type:{
                type: String,
                required: true
            },
            required:{
                type : Boolean,
                required : true
            },
            placeholder:{
                type: String,
                required: false
            },
            action:{
                type: String,
                required: false
            },
            end_point: {
                type: String,
                required: false
            },
            query: {
                type: String,
                required: false    
            },
            values:{
                type : [mongoose.Schema.Types.Mixed],
                required: true
            }
        }
    ]

})

module.exports = Form = mongoose.model('forms',FormSchema);