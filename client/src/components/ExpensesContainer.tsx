import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Loading from './Loading';
import Expense from './Expense';
import Wrapper from '../assets/wrappers/ExpensesContainer';
import PageBtnContainer from './PageBtnContainer';

const ExpensesContainer: React.FC = () => {
  const {
    getExpenses,
    expenses,
    isLoading,
    page,
    totalExpenses,
    search,
    searchCategory,
    sort,
    numOfPages,
  } = useAppContext();

  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line
  }, [page, search, searchCategory, sort]);
  if (isLoading) {
    return <Loading center />;
  }

  if (expenses.length === 0) {
    return (
      <Wrapper>
        <h2>No expenses to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalExpenses} expense{expenses.length > 1 && 's'} found
      </h5>
      <div className="expenses">
        {expenses.map((expense) => {
          return <Expense key={expense._id} {...expense} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default ExpensesContainer;
