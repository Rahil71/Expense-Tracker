import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    budgetLimit:{
        type:Number,
        default:0
    },
    phoneNumber:{
        type:String,
        set:function(value){
            if(!value) return value;
            if(value.startsWith("+")) return value;
            return `+91${value}`;
        }
    }
},{timestamps:true});

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});

userSchema.methods.comparePassword=async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User=mongoose.model("User",userSchema);
export default User;