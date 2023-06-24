import { Int32 } from "mongodb"
import { Schema, model } from "mongoose"

const taskSchema = new Schema({
    titulo: {
        type: String,
        require: true
    },
    estado: {
        type: Int32,
        require: true
    },
    usuario: {
        type: String,
        require: true

    }
},
{
    timestamps: true
})

module.exports = model('taskModel', taskSchema)