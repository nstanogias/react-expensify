import * as actions from './actions';

import { initialState } from './appContext';

const reducer = (state, action) => {
  if (action.type === actions.DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!',
    };
  }
  if (action.type === actions.CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    };
  }

  if (action.type === actions.SETUP_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === actions.SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: true,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      location: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: action.payload.alertText,
    };
  }
  if (action.type === actions.SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === actions.TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === actions.LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      location: '',
      userLocation: '',
    };
  }
  if (action.type === actions.UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === actions.UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      location: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!',
    };
  }
  if (action.type === actions.UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === actions.HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }
  if (action.type === actions.CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editExpenseId: '',
      position: '',
      company: '',
      location: state.userLocation,
      category: 'Household and Services',
    };

    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === actions.CREATE_EXPENSE_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === actions.CREATE_EXPENSE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New Expense Created!',
    };
  }
  if (action.type === actions.CREATE_EXPENSE_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === actions.GET_EXPENSES_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === actions.GET_EXPENSES_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      expenses: action.payload.expenses,
      totalExpenses: action.payload.totalExpenses,
      numOfPages: action.payload.numOfPages,
    };
  }
  if (action.type === actions.SET_EDIT_EXPENSE) {
    const expense = state.expenses.find(
      (expense) => expense._id === action.payload.id
    );
    const { _id, amount, description, category, location } = expense;
    return {
      ...state,
      isEditing: true,
      editExpenseId: _id,
      amount,
      description,
      location,
      category,
    };
  }
  if (action.type === actions.DELETE_EXPENSE_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === actions.EDIT_EXPENSE_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === actions.EDIT_EXPENSE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Expense Updated!',
    };
  }
  if (action.type === actions.EDIT_EXPENSE_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === actions.SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === actions.SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyExpenses: action.payload.monthlyExpenses,
    };
  }
  if (action.type === actions.CLEAR_FILTERS) {
    return {
      ...state,
      search: '',
      searchCategory: 'all',
      sort: 'latest',
    };
  }
  if (action.type === actions.CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }
  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
