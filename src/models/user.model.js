import mongoose, {model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    // TODO: Add fields e.g. name, email, phone
    name:{
      type: String,
      required: true,
      trim: true
    },

    email:{
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    password:{
      type: String,
      required: [true , "password is required"],
    },

    refreshToken:{
      type: String,
    },
  },
  { timestamps: true }
);

/*
NOTE: 🔐 Mongoose pre-save middleware

Runs automatically BEFORE saving a user in the database.

Purpose:
- Hash the password so we never store plain text passwords.

Steps:
1. Check if password field is modified
2. If NOT modified → skip hashing and continue saving
3. If modified → hash password using bcrypt
4. Replace plain password with hashed password
5. Call next() to continue database save process
*/

userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export default model("User", userSchema);
