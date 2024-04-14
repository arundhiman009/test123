import mongoose, {model} from "mongoose";
import contactInterface from "src/interface/contactInterface";

const schema = mongoose.Schema;

const contactSchema = new schema<contactInterface>( 
    {
    name : 
    {
        type: String,
        default: null,
        required:true,
    },
    lastName : 
    {
        type: String, 
        required:true,
    },
    phone : { 
        type: String,
        required:true,
    },
    },
    { 
      timestamps: true 
    },
)

export const contactModel = model("contacts",contactSchema);