import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import styles from "./Campaign.module.css";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import brandLogo from "./../../assets/images/brand.png";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  fetchCompetitions,
  searchCompetitions,
} from "../../reducers/competitions";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";

const Campaign = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    competitions = [],
    loading,
    error,
    totalItems,
    currentPage,
  } = useAppSelector((state) => state.competitions || []);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 20;

  console.log({ competitions });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchCompetitions({ page: currentPage, size: pageSize })).unwrap();
        console.log('API Response:', result);
      } catch (error) {
        console.error('Error fetching competitions:', error);
      }
    };
    fetchData();
  }, [dispatch, currentPage, pageSize]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(
      searchCompetitions({
        title: query,
        // Add other search params as needed
        // status: selectedStatus,
        // startDateFrom: startDate,
        // startDateTo: endDate
      })
    );
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
      })
    );
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
            dispatch(fetchCompetitions({ page: currentPage, size: pageSize }))
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
              { day: "2-digit", month: "short" }
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
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header
        title="Campaigns"
        showSearch
        showAdd
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onMore={handleMore}
      />
      {renderContent()}
      <FloatingActionButton />
    </div>
  );
};

export default Campaign;
