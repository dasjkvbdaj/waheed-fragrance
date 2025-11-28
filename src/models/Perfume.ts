import { Schema, model, models } from 'mongoose';

const PerfumeSizeSchema = new Schema({
    size: { type: String, required: true },
    price: { type: Number, required: true },
}, { _id: false });

const PerfumeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    sizes: [PerfumeSizeSchema],
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    description: {
        type: String,
    },
    notes: {
        type: String,
    },
    price: {
        type: Number,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (_doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: function (_doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

const Perfume = models.Perfume || model('Perfume', PerfumeSchema);

export default Perfume;
