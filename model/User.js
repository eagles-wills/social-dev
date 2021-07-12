import mongoose from 'mongoose'

const {Schema, model} = mongoose;

const UserSchema = new Schema({
    name: String,
    email:String,
    password:String,
    avatar: String,
    createdAt:String,
})

const User = model('user', UserSchema)
export default User; 