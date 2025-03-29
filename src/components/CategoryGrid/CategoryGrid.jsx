import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryGrid.module.css';
import rightArrow from '../../assets/icons/rightArrow.svg';

const CategoryGrid = ({ categories, title, viewAllLink }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to videos page with tag filter
    navigate(`/videos?tag=${category.name.toLowerCase()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <button 
            className={styles.viewAll} 
            onClick={() => navigate(viewAllLink)}
          >
            <img src={rightArrow} alt="View All" className={styles.rightArrow} />
          </button>
        )}
      </div>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={styles.categoryCard}
            onClick={() => handleCategoryClick(category)}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${category.image})`,
            }}
          >
            <span className={styles.categoryName}>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
