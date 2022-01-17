import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Expense';
import ExpenseInfo from './ExpenseInfo';

interface Props {
  _id: string;
  amount: number;
  description: string;
  location: string;
  category: string;
  createdAt: string;
}

const Expense: React.FC<Props> = ({
  _id,
  amount,
  description,
  location,
  category,
  createdAt,
}) => {
  const { setEditExpense, deleteExpense } = useAppContext();

  let date = moment(createdAt).format('MMM Do, YYYY');
  return (
    <Wrapper>
      <header>
        <div className="info">
          <h5>{description}</h5>
          <p>{amount} $</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <ExpenseInfo icon={<FaLocationArrow />} text={location} />
          <ExpenseInfo icon={<FaCalendarAlt />} text={date} />
          <ExpenseInfo icon={<FaBriefcase />} text={category} />
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-expense"
              className="btn edit-btn"
              onClick={() => setEditExpense(_id)}
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteExpense(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Expense;
