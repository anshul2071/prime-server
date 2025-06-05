import mongoose, {Document, Model, Schema} from 'mongoose';


export interface ITimesheet extends Document {
    employee: mongoose.Types.ObjectId
    date: Date
    hours: number
    description?: string
}



const timesheetSchema = new Schema<ITimesheet>({
    
    employee: {
        type: Schema.Types.ObjectId, ref: 'Employee', required: true},
        date: {type: Date, required: true},
        hours: {type: Number, required: true},
        description: {type: String}
    }, {timestamps: true}
)


export const Timesheet: Model<ITimesheet> = mongoose.model('Timesheet', timesheetSchema)