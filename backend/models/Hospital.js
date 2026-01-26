import mongoose from 'mongoose';

const hospitalSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  hospital: {type: String, required: true},
  created: {type: Date, required: false, default: Date.now}
});

export const Hospital = mongoose.model('Hospital', hospitalSchema);
