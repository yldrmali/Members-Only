const mongoose=require('mongoose')
const Schema=mongoose.Schema
const moment=require('moment')


const MessageSchema= new Schema({
    subject:{type:String,required:true},
    message:{type:String,required:true},
    created:{type:Date, default:Date.now(),required:true},
    user:{type:Schema.Types.ObjectId,ref:'User', required:true}
})

MessageSchema.virtual('post_date').get(function(){
    return moment(this.created).calendar()
})

MessageSchema.virtual('url').get(function(){
    return `/main/delete/${this._id}`
})


module.exports=mongoose.model('Message',MessageSchema)