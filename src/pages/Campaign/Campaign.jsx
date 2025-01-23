import { useState } from 'react';
import Header from '../../components/Header/Header';
import styles from './Campaign.module.css';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import brandLogo from "./../../assets/images/brand.png"; 
import FloatingActionButton from '../../components/FloatingActionButton/FloatingActionButton';

const updatedCampaigns = [
  { id: 1, name: 'Campaign 1', status: 'In Progress', startDate: '15Aug', endDate: '20Aug', amount: 40000.00 , brandName:"Brand Name", brandLogo:brandLogo},
  { id: 2, name: 'Campaign 2', status: 'In Progress', startDate: '15Aug', endDate: '20Aug', amount: 150000.00, brandName:"Brand Name" , brandLogo:brandLogo},
  { id: 3, name: 'Campaign 3', status: 'In Progress', startDate: '15Aug', endDate: '20Aug', amount: 150000.00, brandName:"Brand Name" , brandLogo:brandLogo},
  { id: 4, name: 'Campaign 4', status: 'In Progress', startDate: '15Aug', endDate: '20Aug', amount: 40000.00, brandName:"Brand Name" , brandLogo:brandLogo},
  { id: 5, name: 'Campaign 5', status: 'In Progress', startDate: '15Aug', endDate: '20Aug', amount: 150000.00, brandName:"Brand Name" , brandLogo:brandLogo},
  { id: 6, name: 'Campaign 6', status: 'In Progress', startDate: '15Aug', endDate: '20Aug', amount: 40000.00, brandName:"Brand Name" , brandLogo:brandLogo}
];

const Campaign = () => {
  const [campaigns] = useState(updatedCampaigns);

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
            startDate={campaign.startDate}
            endDate={campaign.endDate}
            amount={campaign.amount}
            brandName={campaign.brandName}
            brandLogo={campaign.brandLogo}
          />
        ))}
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default Campaign;
