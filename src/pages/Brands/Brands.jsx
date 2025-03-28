import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchBrands } from "../../reducers/brands";
import { toast } from "react-toastify";
import styles from "./Brands.module.css";
import ListCard from "../../components/ListCard/ListCard";
import Header from "../../components/Header/Header";

const Brands = () => {
  const dispatch = useAppDispatch();
  const { brands, loading, error } = useAppSelector((state) => state.brands);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      await dispatch(fetchBrands()).unwrap();
    } catch (error) {
      toast.error(error || "Failed to fetch sponsors");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
    // For now, we'll just log the query
    console.log("Search query:", query);
  };

  const handleAdd = () => {
    // Implement add functionality
    console.log("Add button clicked");
  };

  const handleMore = () => {
    // Implement more options functionality
    console.log("More options clicked");
  };

  const handleBrandClick = (brandId) => {
    // Handle brand click
    console.log("Brand clicked:", brandId);
  };

  return (
    <div className={styles.container}>
      <Header
        title="Brands"
        showSearch
        showAdd
        showMore
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onMore={handleMore}
        showBack
      />
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          brands.map((brand) => (
            <ListCard
              key={brand.id}
              image={brand.logo || 'https://via.placeholder.com/40'}
              title={brand.name || 'Name'}
              subtitle={brand.username ? `@${brand.username}` : '@user_name'}
              status={brand.status}
              menuIcon="more"
              onMenuClick={handleMore}
              onClick={() => handleBrandClick(brand.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Brands;
