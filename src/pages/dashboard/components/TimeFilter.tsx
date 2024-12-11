import React, { useState, ChangeEvent } from 'react';

interface TimeFilterProps {
  onChange: (value: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ onChange }) => {
  const [selectedTime, setSelectedTime] = useState<string>('Month');

  const handleTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    onChange(newTime);
  };

  return (
    <select value={selectedTime} onChange={handleTimeChange} className="select-css">
      <option value="Hour">Hour</option>
      <option value="Day">Day</option>
      <option value="Week">Week</option>
      <option value="Month">Month</option>
      <option value="Quarter">Quarter</option>
      <option value="Year">Year</option>
      <option value="Biennial">Biennial</option>
    </select>
  );
};

export default TimeFilter;
