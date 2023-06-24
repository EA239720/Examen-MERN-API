require('dotenv').config()


const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const { Schema, model } = mongoose;
const app = express()

app.use(cors())
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Acces-Control-Allow-Origin", "*");
    res.header("Acces-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept");
    next();
});


mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected')).catch((err) => console.log(err))

const userSchema = new Schema(
    {
        user: {
            type: String,
            required: true
        },
        pass: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const userModel = model('user', userSchema)

const taskSchema = new Schema(
    {
        task: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const taskModel = model('task', taskSchema)

app.get('/', (req, res, next) => {
    console.log('accessing root')
    res.send('Working')
})

app.post('/newUser', (req, res, next) => {
    const { values } = req.body
    const { user, pass } = values

    userModel.findOne({ user: user })
        .then((userQuery) => {
            if(userQuery) {
                return res.status(500).send({ 
                    "ok": false, 
                    "mensaje": "Ya existe un usuario con ese nombre"
                })
            } else {
                const newUser = new userModel({ user, pass })
            
                newUser.save()
                    .then(() => res.status(200).send({ 
                        "ok": true,
                        "mensaje" : "Usuario Registado!" 
                    }))
                    .catch((err) => res.status(500).send({
                        "ok": false,
                        "mensaje": "Error al registrar usuario."
                    }))
            }
        })
        .catch((err) => res.status(500).send({
            "ok": false,
            "mensaje": "Error al registrar usuario."
        }))
})

app.post('/newTask', (req, res, next) => {
    const { values } = req.body
    const { task, user, status } = values
    
    const newTask = new taskModel({ task, user, status })

    newTask.save()
        .then(() => res.status(200).send({ 
            "ok": true,
            "mensaje" : "Tarea Registada!" 
        }))
        .catch((err) => res.status(500).send({
            "ok": false,
            "mensaje": "Error al registrar tarea."
        }))
})

app.post('/getTasks', (req, res, next) => {
    const { user } = req.body;

    taskModel.find({ user: user })
        .then((tasksQuery) => {
            if(tasksQuery) {
                return res.status(200).send({ 
                    "ok": true, 
                    "tasks": tasksQuery
                })
            } else {
                res.status(500).send({
                    "ok": false,
                    "mensaje": "Error al consultar las tareas."
                })
            }
        })
        .catch((err) => res.status(500).send({
            "ok": false,
            "mensaje": "Error al consultar las tareas."
        }))
})

app.post('/updateTask', (req, res, next) => {
    const { task, status } = req.body;

    taskModel.updateOne(
        { _id: task },
        { $set: { status: status } }
    ).then((result) => {
        if(result) {
            console.log(result)
            return res.status(200).send({ 
                "ok": true, 
                "mensaje": "Tarea actualizada con exito."
            })
        } else {
            console.log("fisrtBreak")
            res.status(500).send({
                "ok": false,
                "mensaje": "Error al actualizar la tarea."
            })
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send({
            "ok": false,
            "mensaje": "Error al actualizar la tarea."
        })
    })
})
            

app.post('/login', (req, res, next) => {
    const { values } = req.body
    const { user, pass } = values

    userModel.findOne({ user: user })
        .then((userQuery) => {
            if(!userQuery) {
                return res.status(500).send({ 
                    "ok": false, 
                    "mensaje": "No se encontro al usuario."
                })
            } else {
                if(userQuery.pass !== pass) {
                    return res.status(500).send({ 
                        "ok": false, 
                        "mensaje": "Contrasena incorrecta."
                    })
                } else {

                    res.status(200).send({ 
                        "ok": true,
                        "user": userQuery.user 
                    })
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                "ok": false,
                "mensaje": "Error al registrar usuario."
            })
        })
})

app.listen(Number(process.env.PORT), () => console.log("Server Running. Port: " + process.env.PORT))