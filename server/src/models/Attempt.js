import mongoose from 'mongoose'

const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    status: { type: String, required: true, enum: ['solved', 'solved_with_hint', 'failed', 'viewed_solution'] },
    attemptCount: { type: Number, required: true, min: 1, default: 1 },
    timeTaken: { type: Number, min: 0 },
    hintsUsed: { type: Number, min: 0, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

attemptSchema.index({ userId: 1, problemId: 1, createdAt: -1 })
attemptSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Attempt', attemptSchema)
