import mongoose , {Document, Model, Schema}from "mongoose";

export interface IGame extends Document {
    title:string
    description: string
    image?: string
    link: string
    genre: string;
    platform: string;
    releaseDate: string;
}


const gameSchema = new Schema <IGame> (
    {
        title: {
            type: String,
            required: true,
        },
        description : {type:String, required: true},
        image: {type: String},
        link: {type: String},
        genre: {type: String},
        platform: {type:String},
        releaseDate: {type:String}
        
    },

        
    {timestamps: true}
)

export  const Game : Model <IGame> = mongoose.model("Game", gameSchema)