import { useState } from 'react';
import Header from '../../components/Header/Header';
import styles from './Campaign.module.css';

const CampaignCard = ({ name, status, dateRange, amount }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3 className={styles.cardTitle}>{name}</h3>
      {status && <span className={styles.status}>{status}</span>}
      <button className={styles.moreButton} aria-label="More options">
        <span className={styles.moreIcon}>⋮</span>
      </button>
    </div>
    <div className={styles.cardBody}>
      <div className={styles.dateRange}>
        <span className={styles.icon}>📅</span>
        <span>{dateRange}</span>
      </div>
      <div className={styles.amount}>
        <span>Rs {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  </div>
);

const Campaign = () => {
  const [campaigns] = useState([
    { id: 1, name: 'Campaign 1', status: 'In Progress', dateRange: '15Aug - 20Aug', amount: 40000.00 },
    { id: 2, name: 'Campaign 2', status: 'In Progress', dateRange: '15Aug - 20Aug', amount: 150000.00 },
    { id: 3, name: 'Campaign 3', status: 'In Progress', dateRange: '15Aug - 20Aug', amount: 150000.00 },
    { id: 4, name: 'Campaign 4', status: 'In Progress', dateRange: '15Aug - 20Aug', amount: 40000.00 },
    { id: 5, name: 'Campaign 5', status: 'In Progress', dateRange: '15Aug - 20Aug', amount: 150000.00 },
    { id: 6, name: 'Campaign 6', status: 'In Progress', dateRange: '15Aug - 20Aug', amount: 40000.00 },
  ]);

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleAdd = () => {
    // Implement add functionality
  };

  const handleMore = () => {
    // Implement more options functionality
  };

  return (
    <div className={styles.container}>
      <Header 
        title="My Campaigns"
        showSearch
        showAdd
        showMore
        onSearch={handleSearch}
        onAdd={handleAdd}
        onMore={handleMore}
      />
      <div className={styles.content}>
        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            name={campaign.name}
            status={campaign.status}
            dateRange={campaign.dateRange}
            amount={campaign.amount}
          />
        ))}
      </div>
      <button className={styles.fab} aria-label="Add new campaign">
        <span className={styles.fabIcon}>+</span>
      </button>
    </div>
  );
};

export default Campaign;
