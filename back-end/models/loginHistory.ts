import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  connectedAt: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String 
  }
});

export default mongoose.model('LoginHistory', loginHistorySchema);
