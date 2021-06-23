import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema({
   doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   patientEmail: {
      type: String,
      required: true
   },
   dateFrom: {
      type: Date,
      required: true
   }
});

export default model('Appointment', AppointmentSchema);
