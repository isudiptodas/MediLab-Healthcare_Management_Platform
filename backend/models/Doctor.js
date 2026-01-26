import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  hospital: {type: String, required: false},
  speciality: {type: String, required: false},
  gender: {type: String, required: false},
  verified: {type: Boolean, required: false, default: false},
  created: {type: Date, required: false, default: Date.now}
});

export const Doctor = mongoose.model('Doctor', doctorSchema);
 