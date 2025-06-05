import mongoose,{DateToString, Document, Model, Schema} from "mongoose";


export type LeaveStatus = 'pending' | 'approved'| 'rejected'
export interface ILeaveRequest extends Document {
    employee: mongoose.Types.ObjectId
    from: Date
    to: Date
    reason: string
    status: LeaveStatus

}



const leaveSchema = new Schema <ILeaveRequest>({
    employee: {
        type: Schema.Types.ObjectId, ref: 'Employee', required: true
    },
    from: {
        type: Date, required: true
    },
    to: {
        type: Date, required: true
    },

    reason: {
        type: String, required: true
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {timestamps: true}
)



export const LeaveRequest : Model<ILeaveRequest> = mongoose.model('LeaveRequest', leaveSchema)