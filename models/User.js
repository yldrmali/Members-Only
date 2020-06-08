const mongoose=require('mongoose')
const Schema=mongoose.Schema

const UserSchema= new Schema({
    username:{type:String,required:true},
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    password:{type:String,required:true},
    member:{type:Boolean},
    admin:{type:Boolean},
})

UserSchema.virtual('fullname').get(function(){
    return this.firstname+this.lastname
})


module.exports=mongoose.model('User',UserSchema)