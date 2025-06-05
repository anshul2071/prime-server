import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from 'bcryptjs'




export interface IEmployee extends Document {
    name: string;
    email: string;
    password: string
    comparePassword(candidate: string): Promise<boolean>
}


const employeeSchema  = new Schema <IEmployee> ({
    name : {
        type: String, required: true
    },

    email: {type: String, required: true, unique: true},

    password: {type: String, required: true}
}, {timestamps: true}
)



employeeSchema.pre('save', async function() {
    if(!this.isModified('password')) return 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


employeeSchema.methods.comparePassword = function (
    candidate: string
): Promise <boolean> {
    return bcrypt.compare(candidate, this.password)
}



export const Employee: Model<IEmployee> = mongoose.model('Employee', employeeSchema)