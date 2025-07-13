const mongoose=require('mongoose')

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
 image: {
  type: String,
  default: "",
  required: false,
},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);

