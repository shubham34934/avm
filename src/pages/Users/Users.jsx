import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Users.module.css";
import ListCard from "../../components/ListCard/ListCard";
import Header from "../../components/Header/Header";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchUsers, deleteUser } from "../../reducers/users";
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
  const { users, loading, error, totalItems, currentPage } = useAppSelector(
    (state) => state.users
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const pageSize = 20;

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage]);

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
    // navigate(`/users/${user.login}`);
  };

  const handleViewUser = (user) => {
    navigate(`/users/${user.login}`);
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.login}?edit=true`);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.login)).unwrap();
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
    const authorities = combineAuthorities(user.authorities);
    return (
      <>
        <div>{user.login}</div>
        <div>{user.email}</div>
        <div>{authorities}</div>
      </>
    );
  };

  // Use fallback loader if Loader import fails
  const LoaderComponent = Loader || FallbackLoader;

  const renderContent = () => {
    if (loading) {
      return <LoaderComponent />;
    }

    if (error) {
      return (
        <Error
          title="Failed to Load Users"
          message={error}
          onRetry={() =>
            dispatch(fetchUsers({ page: currentPage, size: pageSize }))
          }
        />
      );
    }

    return (
      <div className={styles.content}>
        {users.map((user) => (
          <ListCard
            key={user.id}
            image={user.imageUrl || dummyAvatar}
            title={getUserTitle(user)}
            subtitle={getUserSubtitle(user)}
            status={user.activated ? "Active" : "Inactive"}
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
      {renderContent()}
      
      {userToDelete && (
        <ConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete the user ${getUserTitle(userToDelete)}?`}
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
