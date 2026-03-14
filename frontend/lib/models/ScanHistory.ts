import mongoose, { Schema } from "mongoose"

const ScanHistorySchema = new Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  type:{
    type:String,
    required:true
  },

  input:{
    type:String,
    required:true
  },

  result:{
    type:Schema.Types.Mixed
  },

  scannedAt:{
    type:Date,
    default:Date.now
  }

})

export default mongoose.models.ScanHistory ||
mongoose.model("ScanHistory",ScanHistorySchema)