import express from 'express';
const router = express.Router();

import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
  showStats,
} from '../controllers/expensesController.js';

router.route('/').post(createExpense).get(getAllExpenses);
router.route('/:id').delete(deleteExpense).patch(updateExpense);
router.route('/stats').get(showStats);

export default router;
