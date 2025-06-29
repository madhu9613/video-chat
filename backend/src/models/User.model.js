import mongoose, { Mongoose }  from "mongoose";
import bcrypt from "bcryptjs"
const userSchema=new mongoose.Schema({
 fullName:{
    type:String,
    required:true,
 },
 email:{
    type:String,
    required:true,
    unique:true,
 },
password:{
    type:String,
    required:true,
    minlength:6,
},
bio:{
    type:String,
    default:"",
},
profilePic:{
    type:String,
    default:"",
},
nativeLanguage:{
    type:String,
    default:"",
},
learningLanguage:{
    type:String,
    default:"",
},
location:{
    type:String,
    default:"",
},
//purpose of onboarding is when he will complete this then only he is allowed to proceed further means texting ,and all other things

isOnboarded:{
    type:Boolean,
    default:false,
},
friends:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
]

},{timestamps:true}) 

//we need to protect password so we have to hash our password

userSchema.pre("save",async function (next) {
   if(!this.isModified("password")) return next() ;
   
    try {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next(); 
    } catch (error) {
        next(error);

    }
})
userSchema.methods.ispasswordCorrect=async function (p) 
{
 const ans=await bcrypt.compare(p,this.password);
 return ans;
}



const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
