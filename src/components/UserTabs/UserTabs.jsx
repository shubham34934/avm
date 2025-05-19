import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import BasicInfoTab from './BasicInfoTab';
import BankDetailsTab from './BankDetailsTab';
import VideosTab from './VideosTab';
import ContestsTab from './ContestsTab';
import styles from './UserTabs.module.css';

const UserTabs = ({ user }) => {
  const [searchParams] = useSearchParams();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('basic');
  const isEditModeFromRoute = searchParams.get('edit') === 'true';

  const availableTabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      roles: ['ADMIN', 'SUPER_ADMIN', 'CREATOR', 'USER'],
      showEdit: true,
      component: BasicInfoTab
    },
    {
      id: 'bank',
      label: 'Bank Details',
      roles: ['ADMIN', 'SUPER_ADMIN', 'CREATOR'],
      showEdit: true,
      component: BankDetailsTab
    },
    {
      id: 'videos',
      label: 'Videos Upload',
      roles: ['ADMIN', 'SUPER_ADMIN', 'CREATOR'],
      showEdit: false,
      component: VideosTab
    },
    {
      id: 'contests',
      label: 'Contests Participated',
      roles: ['ADMIN', 'SUPER_ADMIN', 'CREATOR', 'USER'],
      showEdit: false,
      component: ContestsTab
    }
  ];

  const filteredTabs = availableTabs.filter(tab => 
    tab.roles.some(role => hasPermission(role))
  );

  const renderTabContent = () => {
    const activeTabConfig = availableTabs.find(tab => tab.id === activeTab);
    if (!activeTabConfig) return null;

    const TabComponent = activeTabConfig.component;
    return (
      <TabComponent 
        user={user} 
        isEditModeFromRoute={isEditModeFromRoute}
      />
    );
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabList}>
        {filteredTabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserTabs; 