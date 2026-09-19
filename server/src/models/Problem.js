import mongoose from 'mongoose'

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true, trim: true },
    output: { type: String, required: true, trim: true },
    explanation: { type: String, trim: true },
  },
  { _id: false },
)

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
    topics: { type: [String], required: true, validate: [(value) => value.length > 0, 'At least one topic is required'] },
    concepts: { type: [String], required: true, validate: [(value) => value.length > 0, 'At least one concept is required'] },
    examples: { type: [exampleSchema], default: [] },
    constraints: { type: [String], default: [] },
    hints: { type: [String], default: [] },
    externalUrl: { type: String, trim: true },
  },
  { timestamps: true },
)

problemSchema.index({ difficulty: 1, topics: 1 })
problemSchema.index({ topics: 1 })
problemSchema.index({ concepts: 1 })
problemSchema.index({ title: 1 })

export default mongoose.model('Problem', problemSchema)
