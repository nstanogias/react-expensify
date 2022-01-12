import Expense from '../models/Expense';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';
const createExpense = async (req, res) => {
  const { amount, description } = req.body;

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
    queryObject.location = { $regex: search, $options: 'i' };
  }
  // NO AWAIT

  let result = Expense.find(queryObject);

  // chain sort conditions

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  //

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

export { createExpense, deleteExpense, getAllExpenses, updateExpense };
