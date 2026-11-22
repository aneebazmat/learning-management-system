import mongoose, {Schema} from "mongoose";
import type {
    Document,
    Model
} from "mongoose";
import bcrypt from "bcryptjs";
require("dotenv").config();
import jwt, {Secret} from "jsonwebtoken";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword(candidatePassword: string): Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: {
                validator: function (value: string) {
                    return emailRegexPattern.test(value);
                },
                message: "Please enter a valid email"
            },
        },
        password: {
            type: String,
            minlength: 6,
            select: false
        },
        avatar: {
            public_id: String,
            url: String
        },
        role: {
            type: String,
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        courses: [
            {
                courseId: String
            }
        ]
    },
    {
        timestamps: true
    }
);

// Pre-save middleware to hash the password before saving the user document
userSchema.pre<IUser>("save", async function (this: IUser) {
    if (!this.isModified("password") || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to sign an access token for the user
userSchema.methods.SignAccessToken = function (): string {
    const payload = { id: this._id.toString(), role: this.role };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: "7d" });
};

// Method to sign a refresh token for the user
userSchema.methods.SignRefreshToken = function (): string {
    const payload = { id: this._id.toString(), role: this.role };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: "30d" });
};

// Method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
