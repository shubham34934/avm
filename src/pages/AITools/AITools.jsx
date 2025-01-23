import { useState } from 'react';
import styles from './AITools.module.css';
import Header from '../../components/Header/Header';
import aiImage1 from '../../assets/images/aiImages/1.png';
import aiImage2 from '../../assets/images/aiImages/2.png';
import aiImage3 from '../../assets/images/aiImages/3.png';
import aiImage4 from '../../assets/images/aiImages/4.png';
import MoreIcon  from './../../assets/icons/more.svg';
import Tag from '../../components/Tag/Tag';

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
                      <Tag text={tool.status} variant={tool.status.toLowerCase()} size="small" />
                    )}
                  </h3>
                  <button 
                    onClick={() => handleToolMore(tool.id)}
                    className={styles.moreButton}
                  >
                    <img src={MoreIcon} alt="more"/>
                  </button>
                </div>
                <p className={styles.toolPrice}>start from ${tool.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITools;
