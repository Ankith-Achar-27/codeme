import mongoose from 'mongoose'

const userTopicStatsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    attempted: { type: Number, min: 0, default: 0 },
    solved: { type: Number, min: 0, default: 0 },
    successRate: { type: Number, min: 0, max: 100, default: 0 },
    masteryScore: { type: Number, min: 0, max: 100, default: 0 },
    lastPracticed: { type: Date },
  },
  { timestamps: true },
)

userTopicStatsSchema.index({ userId: 1, topic: 1 }, { unique: true })
userTopicStatsSchema.path('solved').validate(function validateSolved(value) {
  return value <= this.attempted
}, 'Solved count cannot exceed attempted count')

export default mongoose.model('UserTopicStats', userTopicStatsSchema)
