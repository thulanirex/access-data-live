import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { featureUsageData } from '../../../../data/obdxData';

const FeatureUsageRadarChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={featureUsageData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="feature" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name="Usage" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default FeatureUsageRadarChart;
