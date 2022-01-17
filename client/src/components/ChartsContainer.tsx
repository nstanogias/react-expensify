import React, { useState } from 'react';

import BarChart from './BarChart';
import AreaChart from './AreaChart';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/ChartsContainer';

const ChartsContainer: React.FC = () => {
  const [barChart, setBarChart] = useState(true);
  const { monthlyExpenses: data } = useAppContext();
  return (
    <Wrapper>
      <h4>Monthly Expenses</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? 'Area Chart' : 'Bar Chart'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};

export default ChartsContainer;
