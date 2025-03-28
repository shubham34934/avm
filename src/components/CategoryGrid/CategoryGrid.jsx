import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryGrid.module.css';

const CategoryGrid = ({ categories, title, viewAllLink }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <button 
            className={styles.viewAll} 
            onClick={() => navigate(viewAllLink)}
          >
            View All
          </button>
        )}
      </div>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={styles.categoryCard}
            onClick={() => navigate(`/category/${category.id}`)}
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
