import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from 'bcryptjs'

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    comparePassword (candidate: string) : Promise<boolean>

}

const adminSchema = new Schema<IAdmin>({
    name: {type: String , required: true},
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true},
    isVerified: {type: Boolean, required: false}
},

{timestamps: true}

)


adminSchema.pre('save', async function() {
    if(!this.isModified('password')) return 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


adminSchema.methods.comparePassword = function (
    candidate: string
) : Promise<boolean> {
    return bcrypt.compare(candidate, this.password)
}


export const Admin : Model <IAdmin>  = mongoose.model('Admin', adminSchema)
