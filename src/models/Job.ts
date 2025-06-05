import mongoose, {Document, Model, Schema} from 'mongoose'

export interface IJob extends Document {
    title: string
    location: string
    description: string
    applyLink : string

}


const jobSchema = new Schema <IJob> ({
    title : {type:String, required: true},
    location:{type: String, required: true},
    description:{type: String, required: true},
    applyLink: {type:String, required: true},


},

{timestamps: true}
)


export const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema)