import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddExpense: React.FC = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    amount,
    description,
    location,
    category,
    categoryOptions,
    handleChange,
    clearValues,
    createExpense,
    editExpense,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !description || !location) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editExpense();
      return;
    }
    createExpense();
  };
  const handleExpenseInput = (e) => {
    handleChange(e.target.name, e.target.value);
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'edit expense' : 'add expense'}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="number"
            name="amount"
            value={amount}
            handleChange={handleExpenseInput}
          />
          <FormRow
            type="text"
            name="description"
            value={description}
            handleChange={handleExpenseInput}
          />
          <FormRow
            type="text"
            labelText="expense location"
            name="location"
            value={location}
            handleChange={handleExpenseInput}
          />
          <FormRowSelect
            name="category"
            value={category}
            handleChange={handleExpenseInput}
            list={categoryOptions}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddExpense;
