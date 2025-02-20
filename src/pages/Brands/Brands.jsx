import { useState } from "react";
import styles from "./Brands.module.css";
import ListCard from "../../components/ListCard/ListCard";
import { brands } from "../../data/mockData";

const Brands = () => {
  const [brandsList] = useState(brands);

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleAdd = () => {
    // Implement add functionality
  };

  const handleMore = () => {
    // Implement more options functionality
  };

  const handleBrandClick = (brandId) => {
    // Handle brand click
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {brandsList.map((brand) => (
          <ListCard
            key={brand.id}
            image={brand.logo}
            title={brand.name}
            subtitle={brand.username}
            status={brand.status}
            onClick={() => handleBrandClick(brand.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Brands;
