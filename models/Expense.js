import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
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
        'Household and Services',
        'Health and Beauty',
        'Food and Drinks',
        'Shopping',
      ],
      default: 'Household and Services',
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
