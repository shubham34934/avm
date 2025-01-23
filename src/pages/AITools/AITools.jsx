import { useState } from 'react';
import styles from './AITools.module.css';
import Header from '../../components/Header/Header';
import aiImage1 from '../../assets/images/aiImages/1.png';
import aiImage2 from '../../assets/images/aiImages/2.png';
import aiImage3 from '../../assets/images/aiImages/3.png';
import aiImage4 from '../../assets/images/aiImages/4.png';

const tools = [
  {
    id: 1,
    name: 'Tool name',
    icon: aiImage1,
    price: 20,
    status: 'active'
  },
  {
    id: 2,
    name: 'Tool name',
    icon: aiImage2,
    price: 20,
    status: 'active'
  },
  {
    id: 3,
    name: 'User_Name',
    icon: aiImage3,
    price: 20,
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Tool name',
    icon: aiImage4,
    price: 20,
    status: 'active'
  },
  {
    id: 5,
    name: 'Tool name',
    icon: aiImage1,
    price: 20,
    status: 'active'
  },
  {
    id: 6,
    name: 'Tool name',
    icon: aiImage2,
    price: 20,
    status: 'active'
  },
  {
    id: 7,
    name: 'User_Name',
    icon: aiImage3,
    price: 20,
    status: 'inactive'
  },
  {
    id: 8,
    name: 'Tool name',
    icon: aiImage4,
    price: 20,
    status: 'active'
  }
];

const AITools = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAdd = () => {
    // Handle add action
  };

  const handleMore = () => {
    // Handle more options
  };

  const handleToolMore = (toolId) => {
    // Handle individual tool more options
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Header 
        title="AI Tools"
        showSearch
        onSearch={handleSearch}
        showAdd
        onAdd={handleAdd}
        showMore
        onMore={handleMore}
      />

      <div className={styles.toolsList}>
        {filteredTools.map(tool => (
          <div key={tool.id} className={styles.toolCard}>
            <div className={styles.toolInfo}>
              <img 
                src={tool.icon} 
                alt={tool.name} 
                className={styles.toolIcon}
              />
              <div className={styles.toolDetails}>
                <div className={styles.toolHeader}>
                  <h3 className={styles.toolName}>
                    {tool.name}
                    {tool.status === 'inactive' && (
                      <span className={styles.inactiveTag}>Inactive</span>
                    )}
                  </h3>
                  <button 
                    onClick={() => handleToolMore(tool.id)}
                    className={styles.moreButton}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <p className={styles.toolPrice}>start from ${tool.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.fab}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default AITools;
