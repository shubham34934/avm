import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchBrands, deleteBrand } from "../../reducers/brands";
import { toast } from "react-toastify";
import styles from "./Brands.module.css";
import ListCard from "../../components/ListCard/ListCard";
import Header from "../../components/Header/Header";
import Popover from "../../components/Popover/Popover";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { brands, loading, error } = useAppSelector((state) => state.brands);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

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
  };

  // Filter brands based on search query
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) {
      return brands;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return brands.filter((brand) => {
      const sponsorName = (brand.sponsorName || brand.name || "").toLowerCase();
      const sponsorDescription = (brand.sponsorDescription || "").toLowerCase();

      return (
        sponsorName.includes(lowerCaseQuery) ||
        sponsorDescription.includes(lowerCaseQuery)
      );
    });
  }, [brands, searchQuery]);

  const handleAdd = () => {
    // Navigate to create sponsor page
    navigate("/sponsor/create");
  };

  const handleMore = () => {
    // Implement more options functionality
    console.log("More options clicked");
  };

  const handleMenuClick = (e, brand) => {
    e.stopPropagation();
    if (selectedBrand === brand && menuOpen) {
      handleCloseMenu();
    } else {
      setMenuOpen(true);
      setSelectedBrand(brand);
    }
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setSelectedBrand(null);
  };

  const handleViewBrand = (brand) => {
    console.log("View brand:", brand.id);
    // Navigate to brand details page
    // navigate(`/brands/${brand.id}`);
  };

  const handleEditBrand = (brand) => {
    console.log("Edit brand:", brand.id);
    // Navigate to edit brand page
    navigate(`/sponsor/create?edit=true&id=${brand.id}`);
  };

  const handleDeleteBrand = (brand) => {
    console.log("Delete brand:", brand.id);
    setBrandToDelete(brand);
    // Show confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      try {
        await dispatch(deleteBrand(brandToDelete.id)).unwrap();
        toast.success(
          `Brand "${
            brandToDelete.sponsorName || brandToDelete.name || "Unnamed"
          }" deleted successfully`
        );
        setBrandToDelete(null);
      } catch (error) {
        toast.error(error || "Failed to delete brand");
      }
    }
  };

  const handleMenuOptionClick = (e, option, brand) => {
    e.stopPropagation();
    handleCloseMenu();

    switch (option) {
      case "view":
        handleViewBrand(brand);
        break;
      case "edit":
        handleEditBrand(brand);
        break;
      case "delete":
        handleDeleteBrand(brand);
        break;
      default:
        break;
    }
  };

  const handleBrandClick = (brandId) => {
    // Handle brand click
    console.log("Brand clicked:", brandId);
    const brand = brands.find((b) => b.id === brandId);
    if (brand) {
      handleViewBrand(brand);
    }
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
        ) : filteredBrands.length === 0 ? (
          <div className={styles.noResults}>
            {searchQuery
              ? `No brands found matching "${searchQuery}"`
              : "No brands found"}
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <ListCard
              key={brand.id}
              image={
                brand.sponsorLogoUrl ||
                brand.logo ||
                "https://via.placeholder.com/40"
              }
              title={brand.sponsorName || brand.name || "Name"}
              subtitle={brand.sponsorDescription || ""}
              status={brand.isActive ? "Active" : "Inactive"}
              menuIcon="more_vert"
              onMenuClick={(e) => handleMenuClick(e, brand)}
              onClick={() => handleBrandClick(brand.id)}
              menuContent={
                menuOpen && selectedBrand === brand ? (
                  <Popover onClose={handleCloseMenu}>
                    <div className={styles.menuOptions}>
                      <button
                        onClick={(e) => handleMenuOptionClick(e, "view", brand)}
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => handleMenuOptionClick(e, "edit", brand)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) =>
                          handleMenuOptionClick(e, "delete", brand)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </Popover>
                ) : null
              }
            />
          ))
        )}
      </div>

      {brandToDelete && (
        <ConfirmationModal
          title="Delete Brand"
          message={`Are you sure you want to delete the brand "${
            brandToDelete.sponsorName || brandToDelete.name || "Unnamed"
          }"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setBrandToDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default Brands;
