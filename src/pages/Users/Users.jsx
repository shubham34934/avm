import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Users.module.css";
import ListCard from "../../components/ListCard/ListCard";
import Header from "../../components/Header/Header";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchUsers, deleteUser } from "../../reducers/users";
import { fetchVideoUsers, deleteVideoUser } from "../../reducers/videoUsers";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import dummyAvatar from "./../../assets/images/default-avatar.png";
import Popover from "../../components/Popover/Popover";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import {
  getUserTypeDisplay,
  combineAuthorities,
  getUserTitle,
} from "../../utils/constants";

// Fallback Loader component in case the import fails
const FallbackLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Loading...
  </div>
);

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('video'); // Changed default to 'video'
  
  // Admin users state
  const { users, loading: adminLoading, error: adminError, totalItems: adminTotalItems, currentPage: adminCurrentPage } = useAppSelector(
    (state) => state.users
  );
  
  // Video users state
  const { videoUsers, loading: videoLoading, error: videoError, totalItems: videoTotalItems, currentPage: videoCurrentPage } = useAppSelector(
    (state) => state.videoUsers
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const pageSize = 20;

  useEffect(() => {
    if (activeTab === 'admin') {
      dispatch(fetchUsers({ page: adminCurrentPage, size: pageSize }));
    } else {
      dispatch(fetchVideoUsers({ page: videoCurrentPage, size: pageSize }));
    }
  }, [dispatch, activeTab, adminCurrentPage, videoCurrentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  const handleAdd = () => {
    // TODO: Implement add functionality
  };

  const handleMore = () => {
    // Implement pagination or load more logic
  };

  const handleUserClick = (user) => {
    navigate(`/users/${user.login || user.userName}`);
  };

  const handleViewUser = (user) => {
    navigate(`/users/${user.login || user.userName}`);
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.login || user.userName}?edit=true`);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        if (activeTab === 'admin') {
          await dispatch(deleteUser(userToDelete.login)).unwrap();
        } else {
          await dispatch(deleteVideoUser(userToDelete.id.toString())).unwrap();
        }
        setUserToDelete(null);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleMenuClick = (e, user) => {
    e.stopPropagation();
    setMenuOpen(true);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setSelectedUser(null);
  };

  const handleMenuOptionClick = (e, option, user) => {
    e.stopPropagation();
    setMenuOpen(false);
    setSelectedUser(null);

    switch (option) {
      case "view":
        handleViewUser(user);
        break;
      case "edit":
        handleEditUser(user);
        break;
      case "delete":
        setUserToDelete(user);
        break;
      default:
        break;
    }
  };

  const getUserSubtitle = (user) => {
    if (activeTab === 'admin') {
      const authorities = combineAuthorities(user.authorities);
      return (
        <>
          <div>{user.email}</div>
          <div>{authorities}</div>
        </>
      );
    } else {
      return (
        <>
          <div>{user.email}</div>
          <div>{user.phone}</div>
        </>
      );
    }
  };

  // Use fallback loader if Loader import fails
  const LoaderComponent = Loader || FallbackLoader;

  const renderContent = () => {
    const loading = activeTab === 'admin' ? adminLoading : videoLoading;
    const error = activeTab === 'admin' ? adminError : videoError;
    const userList = activeTab === 'admin' ? users : videoUsers;

    if (loading) {
      return <LoaderComponent />;
    }

    if (error) {
      return (
        <Error
          title="Failed to Load Users"
          message={error}
          onRetry={() => {
            if (activeTab === 'admin') {
              dispatch(fetchUsers({ page: adminCurrentPage, size: pageSize }));
            } else {
              dispatch(fetchVideoUsers({ page: videoCurrentPage, size: pageSize }));
            }
          }}
        />
      );
    }

    return (
      <div className={styles.content}>
        {userList.map((user) => (
          <ListCard
            key={user.id}
            image={user.imageUrl || dummyAvatar}
            title={activeTab === 'admin' ? getUserTitle(user) : user.name}
            subtitle={getUserSubtitle(user)}
            status={activeTab === 'admin' ? (user.activated ? "Active" : "Inactive") : (user.isActive ? "Active" : "Inactive")}
            onClick={() => handleUserClick(user)}
            menuIcon="more_vert"
            onMenuClick={(e) => handleMenuClick(e, user)}
            menuContent={
              menuOpen && selectedUser === user ? (
                <Popover onClose={handleCloseMenu}>
                  <div className={styles.menuOptions}>
                    <button
                      onClick={(e) => handleMenuOptionClick(e, "view", user)}
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => handleMenuOptionClick(e, "edit", user)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleMenuOptionClick(e, "delete", user)}
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
        title="Users"
        showSearch
        showAdd
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onMore={handleMore}
      />
      <div className={styles.tabsContainer}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tabButton} ${activeTab === 'video' ? styles.active : ''}`}
            onClick={() => setActiveTab('video')}
          >
            Video Users
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'admin' ? styles.active : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Users
          </button>
        </div>
        {renderContent()}
      </div>

      {userToDelete && (
        <ConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete the user ${activeTab === 'admin' ? getUserTitle(userToDelete) : userToDelete.name}?`}
          onConfirm={handleDeleteUser}
          onCancel={() => setUserToDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default Users;
