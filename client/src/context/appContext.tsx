import React, { useReducer, useContext } from 'react';

import reducer from './reducer';
import axios from 'axios';
import * as action from './actions';
import { Expense } from '../models/Expense';
import { User } from '../models/User';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

type AppContextObj = {
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
  user: User | null;
  token: string | null;
  userLocation: string;
  showSidebar: boolean;
  isEditing: boolean;
  editExpenseId: string;
  amount: number;
  description: string;
  location: string;
  categoryOptions: string[];
  category: string;
  expenses: Expense[];
  totalExpenses: number;
  numOfPages: number;
  page: number;
  monthlyExpenses: number;
  search: string;
  searchCategory: string;
  sort: string;
  sortOptions: string[];
  displayAlert: () => void;
  setupUser: (
    currentUser: { name: string; email: string; password: string },
    endPoint: string,
    alertText: string
  ) => void;
  toggleSidebar: () => void;
  logoutUser: () => void;
  updateUser: (currentUser: {
    name: string;
    email: string;
    password?: string;
    lastName: string;
    location: string;
  }) => void;
  handleChange: (name: string, value: string) => void;
  clearValues: () => void;
  createExpense: () => void;
  getExpenses: () => void;
  setEditExpense: (id: string) => void;
  deleteExpense: (expenseId: string) => void;
  editExpense: () => void;
  showStats: () => void;
  clearFilters: () => void;
  changePage: (page: number) => void;
};

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  showSidebar: false,
  isEditing: false,
  editExpenseId: '',
  amount: 0,
  description: '',
  location: userLocation || '',
  categoryOptions: [
    'Household and Services',
    'Health and Beauty',
    'Food and Drinks',
    'Shopping',
  ],
  category: 'Household and Services',
  expenses: [],
  totalExpenses: 0,
  numOfPages: 1,
  page: 1,
  monthlyExpenses: 0,
  search: '',
  searchCategory: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', '$ (asc)', '$ (desc)'],
  displayAlert: () => {},
  setupUser: () => {},
  toggleSidebar: () => {},
  logoutUser: () => {},
  updateUser: () => {},
  handleChange: () => {},
  clearValues: () => {},
  createExpense: () => {},
  getExpenses: () => {},
  setEditExpense: (id: string) => {},
  deleteExpense: (expenseId: string) => {},
  editExpense: () => {},
  showStats: () => {},
  clearFilters: () => {},
  changePage: (page: number) => {},
};

export const AppContext = React.createContext<AppContextObj>({
  ...initialState,
});

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  authFetch.interceptors.request.use(
    (config: any) => {
      config.headers.common['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: action.DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: action.CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('location');
  };

  const setupUser = async (
    currentUser: { name: string; email: string; password: string },
    endPoint: string,
    alertText: string
  ) => {
    console.log(currentUser);
    dispatch({ type: action.SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, token, location } = data;
      dispatch({
        type: action.SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error: any) {
      dispatch({
        type: action.SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: action.TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: action.LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: action.UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);

      const { user, location, token } = data;

      dispatch({
        type: action.UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage({ user, location, token });
    } catch (error: any) {
      if (error.response.status !== 401) {
        dispatch({
          type: action.UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = (name: string, value: string) => {
    dispatch({ type: action.HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: action.CLEAR_VALUES });
  };

  const createExpense = async () => {
    dispatch({ type: action.CREATE_EXPENSE_BEGIN });
    try {
      const { amount, description, location, category } = state;
      await authFetch.post('/expenses', {
        amount,
        description,
        location,
        category,
      });
      dispatch({ type: action.CREATE_EXPENSE_SUCCESS });
      dispatch({ type: action.CLEAR_VALUES });
    } catch (error: any) {
      if (error.response.status === 401) return;
      dispatch({
        type: action.CREATE_EXPENSE_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getExpenses = async () => {
    const { page, search, searchCategory, sort } = state;

    let url = `/expenses?page=${page}&category=${searchCategory}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: action.GET_EXPENSES_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { expenses, totalExpenses, numOfPages } = data;
      dispatch({
        type: action.GET_EXPENSES_SUCCESS,
        payload: {
          expenses,
          totalExpenses,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditExpense = (id) => {
    dispatch({ type: action.SET_EDIT_EXPENSE, payload: { id } });
  };

  const editExpense = async () => {
    dispatch({ type: action.EDIT_EXPENSE_BEGIN });

    try {
      const { amount, description, location, category } = state;
      await authFetch.patch(`/expenses/${state.editExpenseId}`, {
        amount,
        description,
        location,
        category,
      });
      dispatch({ type: action.EDIT_EXPENSE_SUCCESS });
      dispatch({ type: action.CLEAR_VALUES });
    } catch (error: any) {
      if (error.response.status === 401) return;
      dispatch({
        type: action.EDIT_EXPENSE_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteExpense = async (expenseId: string) => {
    dispatch({ type: action.DELETE_EXPENSE_BEGIN });
    try {
      await authFetch.delete(`/expenses/${expenseId}`);
      getExpenses();
    } catch (error) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: action.SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/expenses/stats');
      dispatch({
        type: action.SHOW_STATS_SUCCESS,
        payload: { monthlyExpenses: data.monthlyExpenses },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: action.CLEAR_FILTERS });
  };

  const changePage = (page: number) => {
    dispatch({ type: action.CHANGE_PAGE, payload: { page } });
  };

  const contextValue: AppContextObj = {
    ...state,
    displayAlert,
    setupUser,
    toggleSidebar,
    logoutUser,
    updateUser,
    handleChange,
    clearValues,
    createExpense,
    getExpenses,
    setEditExpense,
    deleteExpense,
    editExpense,
    showStats,
    clearFilters,
    changePage,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
