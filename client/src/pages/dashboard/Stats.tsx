import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, ChartsContainer } from '../../components';

const Stats: React.FC = () => {
  const { showStats, isLoading, monthlyExpenses } = useAppContext();

  useEffect(() => {
    showStats();
    // eslint-disable-next-line
  }, []);
  if (isLoading) {
    return <Loading center />;
  }
  return <>{monthlyExpenses && <ChartsContainer />}</>;
};

export default Stats;
