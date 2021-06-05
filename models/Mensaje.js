const {Schema, model} = require('mongoose');
const { schema } = require('./Usuario');

const MensajeSchema = Schema({
    de: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    mensaje: {
        type: String,
        required: true
    }
   
},{
    timestamps: true //Fecha de creación y de última modificación
});

//Método que permite extraer elementos a la hora de serializar.
MensajeSchema.method('toJSON', function(){
    const {__v,...object} = this.toObject();
    return object;
});

module.exports = model('Mensaje', MensajeSchema)