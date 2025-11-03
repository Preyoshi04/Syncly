import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Create a schema (structure) for the User collection
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // This field must be provided
      unique: true,   // No two users can have the same username
    },
    email: {
      type: String,
      required: true, // Email is mandatory
      unique: true,   // Each email must be unique
    },
    password: {
      type: String,
      required: true, // Password is required for authentication
    },
  },
  {
    timestamps: true, // Automatically adds "createdAt" and "updatedAt" fields
  }
);

/* 
  🔒 PRE-SAVE MIDDLEWARE:
  This function runs *automatically* before saving a user to the database.
  It checks if the password field is new or modified, and if yes,
  it hashes (encrypts) the password using bcrypt before saving.
*/
userSchema.pre("save", async function (next) {
  // If the password is not modified (e.g., updating username), skip hashing
  if (!this.isModified("password")) {
    return next();
  }

  // Generate a random salt (adds randomness to the hash)
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the generated salt
  this.password = await bcrypt.hash(this.password, salt);

  // Continue with saving the user
  next();
});

/*
  🔍 INSTANCE METHOD:
  This method will be available on all user documents.
  It compares a plain text password (entered by the user during login)
  with the hashed password stored in the database.
*/
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare returns true if passwords match, else false
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the Mongoose model (collection name: "nusers" by default)
const User = mongoose.model("User", userSchema);

export default User;
