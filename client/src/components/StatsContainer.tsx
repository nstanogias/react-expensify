import { useAppContext } from '../context/appContext';
import StatItem from './StatItem';
import { FaHome, FaWalking, FaMugHot, FaShoppingBag } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';

const StatsContainer = () => {
  const { stats } = useAppContext();

  const defaultStats = [
    {
      title: 'household & services',
      count: stats.household_and_services || 0,
      icon: <FaHome />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'health & beauty',
      count: stats.health_and_beauty || 0,
      icon: <FaWalking />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'food & drinks',
      count: stats.food_and_drinks || 0,
      icon: <FaMugHot />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
    {
      title: 'Shopping',
      count: stats.shopping || 0,
      icon: <FaShoppingBag />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
