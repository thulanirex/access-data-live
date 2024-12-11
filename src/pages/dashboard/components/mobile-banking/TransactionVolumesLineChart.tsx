import React from 'react';
import { Funnel, FunnelChart, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { customerSatisfactionData } from '../../../../data/MobileBankingData';

const CustomerSatisfactionFunnelChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <FunnelChart>
        <Tooltip />
        <Funnel
          dataKey="value"
          data={customerSatisfactionData}
          isAnimationActive
          >
          <LabelList position="right" fill="#000" stroke="none" dataKey="stage" />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};

export default CustomerSatisfactionFunnelChart;
