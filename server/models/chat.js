import mongoose from "mongoose";
import AutoIncrement from 'mongoose-sequence';

const messagesSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
}, {
    collection: 'messages' // specify the collection name here
});

// Apply the auto-increment plugin to your schema
messagesSchema.plugin(AutoIncrement(mongoose), { inc_field: 'id' });

export default mongoose.model("messages", messagesSchema);