import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: number,
      required: [true, 'Please provide amount'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: 100,
    },
    category: {
      type: String,
      enum: [
        'Household & Services',
        'Health & Beauty',
        'Food & Drinks',
        'Shopping',
      ],
      default: 'Household & Services',
    },
    location: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', ExpenseSchema);
