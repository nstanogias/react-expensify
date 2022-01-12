import express from 'express';
const router = express.Router();

import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from '../controllers/expensesController.js';

router.route('/').post(createExpense).get(getAllExpenses);
router.route('/:id').delete(deleteExpense).patch(updateExpense);

export default router;
