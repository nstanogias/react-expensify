import Expense from '../models/Expense.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';

const createExpense = async (req, res) => {
  const { amount, description } = req.body;

  if (amount <= 0) {
    throw new BadRequestError('Amount has to be greater than 0!');
  }

  if (!amount || !description) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;
  const expense = await Expense.create(req.body);
  res.status(StatusCodes.CREATED).json({ expense });
};

const getAllExpenses = async (req, res) => {
  const { category, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (category && category !== 'all') {
    queryObject.category = category;
  }
  if (search) {
    queryObject.description = { $regex: search, $options: 'i' };
  }

  let result = Expense.find(queryObject);

  // chain sort conditions

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === '$ (asc)') {
    result = result.sort('amount');
  }
  if (sort === '$ (desc)') {
    result = result.sort('-amount');
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const expenses = await result;

  const totalExpenses = await Expense.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalExpenses / limit);

  res.status(StatusCodes.OK).json({ expenses, totalExpenses, numOfPages });
};

const updateExpense = async (req, res) => {
  const { id: expenseId } = req.params;
  const { amount, description } = req.body;

  if (!amount || !description) {
    throw new BadRequestError('Please provide all values');
  }
  const expense = await Expense.findOne({ _id: expenseId });

  if (!expense) {
    throw new NotFoundError(`No expense with id :${expenseId}`);
  }
  // check permissions

  checkPermissions(req.user, expense.createdBy);

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: expenseId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedExpense });
};

const deleteExpense = async (req, res) => {
  const { id: expenseId } = req.params;

  const expense = await Expense.findOne({ _id: expenseId });

  if (!expense) {
    throw new NotFoundError(`No expense with id :${expenseId}`);
  }

  checkPermissions(req.user, expense.createdBy);

  await expense.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Expense removed' });
};

const showStats = async (req, res) => {
  let monthlyExpenses = await Expense.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyExpenses = monthlyExpenses
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ monthlyExpenses });
};

export {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
  showStats,
};
