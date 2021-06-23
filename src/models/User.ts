import { Schema, model } from "mongoose";

const UserSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   type: {
      type: String,
      required: true
   },
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   gender: {
      type: String,
      required: true
   },
   address: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: false
   }
});

export default model('User', UserSchema);
