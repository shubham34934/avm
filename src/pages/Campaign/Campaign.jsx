import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import styles from "./Campaign.module.css";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import brandLogo from "./../../assets/images/brand.png";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  fetchCompetitions,
  searchCompetitions,
  deleteCompetition,
} from "../../reducers/competitions";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import Popover from "../../components/Popover/Popover";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const Campaign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    competitions = [],
    loading,
    error,
    totalItems,
    currentPage,
  } = useAppSelector((state) => state.competitions || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const pageSize = 20;

  // Get status filter from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status");

  // Set page title based on status filter
  const getPageTitle = () => {
    if (statusFilter === "active") {
      return "Live Campaigns";
    } else if (statusFilter === "completed") {
      return "Completed Campaigns";
    }
    return "All Campaigns";
  };

  const fetchData = async () => {
    try {
      const result = await dispatch(
        fetchCompetitions({
          page: currentPage,
          size: pageSize,
          status: statusFilter,
        })
      ).unwrap();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, currentPage, pageSize, statusFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      dispatch(
        searchCompetitions({
          title: query,
        })
      );
    } else {
      fetchData();
    }
  };

  const handleAdd = () => {
    navigate("/campaign/create");
  };

  const handleMore = () => {
    dispatch(
      fetchCompetitions({
        page: currentPage + 1,
        size: pageSize,
        sort: ["startDate,desc"],
        status: statusFilter,
      })
    );
  };

  const handleMenuClick = (e, campaign) => {
    e.stopPropagation();
    if (selectedCampaign === campaign && menuOpen) {
      handleCloseMenu();
    } else {
      setMenuOpen(true);
      setSelectedCampaign(campaign);
    }
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setSelectedCampaign(null);
  };

  const handleViewCampaign = (campaign) => {
    navigate(`/campaign/${campaign.id}`);
  };

  const handleEditCampaign = (campaign) => {
    navigate(`/campaign/create?edit=true&id=${campaign.id}`);
  };

  const handleDeleteCampaign = async () => {
    if (campaignToDelete) {
      try {
        await dispatch(deleteCompetition(campaignToDelete.id)).unwrap();
        setCampaignToDelete(null);
      } catch (error) {
        console.error("Failed to delete campaign:", error);
      }
    }
  };

  const handleMenuOptionClick = (e, option, campaign) => {
    e.stopPropagation();
    handleCloseMenu();

    switch (option) {
      case "view":
        handleViewCampaign(campaign);
        break;
      case "edit":
        handleEditCampaign(campaign);
        break;
      case "delete":
        setCampaignToDelete(campaign);
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <Error
          title="Failed to Load Campaigns"
          message={error}
          onRetry={() =>
            dispatch(
              fetchCompetitions({
                page: currentPage,
                size: pageSize,
                status: statusFilter,
              })
            )
          }
        />
      );
    }

    return (
      <div className={styles.content}>
        {competitions.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            name={campaign.title}
            startDate={new Date(campaign.startDate).toLocaleDateString(
              "en-US",
              {
                day: "2-digit",
                month: "short",
              }
            )}
            endDate={new Date(campaign.endDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
            amount={campaign.totalPrizeValue}
            status={campaign.status}
            brandName={campaign.sponsor?.name || "Brand Name"}
            brandLogo={campaign.sponsor?.logo || brandLogo}
            onClick={() => {
              navigate(`/campaign/${campaign.id}`);
            }}
            menuIcon="more_vert"
            onMenuClick={(e) => handleMenuClick(e, campaign)}
            menuContent={
              menuOpen && selectedCampaign === campaign ? (
                <Popover onClose={handleCloseMenu}>
                  <div className={styles.menuOptions}>
                    <button
                      onClick={(e) =>
                        handleMenuOptionClick(e, "view", campaign)
                      }
                    >
                      View
                    </button>
                    <button
                      onClick={(e) =>
                        handleMenuOptionClick(e, "edit", campaign)
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) =>
                        handleMenuOptionClick(e, "delete", campaign)
                      }
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </Popover>
              ) : null
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header
        title={getPageTitle()}
        showSearch
        showAdd
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onMore={handleMore}
      />
      {renderContent()}
      {campaignToDelete && (
        <ConfirmationModal
          title="Delete Campaign"
          message={`Are you sure you want to delete the campaign "${campaignToDelete.title}"?`}
          onConfirm={handleDeleteCampaign}
          onCancel={() => setCampaignToDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
      <FloatingActionButton />
    </div>
  );
};

export default Campaign;
