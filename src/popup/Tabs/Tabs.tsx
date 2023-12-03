import * as React from 'react';

import './Tabs.css';

type Props = {
  headers: string[];
  onTabChange?: (index: number) => void;
  children: React.ReactNode[];
};

export const Tabs = ({
  headers,
  onTabChange,
  children,
}: Props) => {
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    if (activeTab >= headers.length) {
      setActiveTab(headers.length - 1);
    }
  }, [headers.length]);

  React.useEffect(() => {
    if (onTabChange) onTabChange(activeTab);
  }, [activeTab]);

  return (
    <div className='tabs'>
      <div className='tab-headers'>
        {headers.map((header, i) => (
          <div
            key={i}
            className={`tab-header ${i === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {header}
          </div>
        ))}
      </div>
      <div className='tab-content'>
        {children[activeTab]}
      </div>
    </div>
  );
};