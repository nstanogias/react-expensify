import Wrapper from '../assets/wrappers/ExpenseInfo';

const ExpenseInfo: React.FC<{ icon: JSX.Element; text: string }> = ({
  icon,
  text,
}) => {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </Wrapper>
  );
};

export default ExpenseInfo;
