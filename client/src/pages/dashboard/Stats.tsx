import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, ChartsContainer } from '../../components';
import StatsContainer from '../../components/StatsContainer';

const Stats: React.FC = () => {
  const { showStats, isLoading, monthlyExpenses } = useAppContext();

  useEffect(() => {
    showStats();
    // eslint-disable-next-line
  }, []);
  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <StatsContainer />
      {monthlyExpenses && <ChartsContainer />}
    </>
  );
};

export default Stats;
