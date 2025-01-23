import { useState } from 'react';
import styles from './Users.module.css';
import ListCard from '../../components/ListCard/ListCard';
import { users } from '../../data/mockData';

const Users = () => {
  const [usersList] = useState(users);

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleAdd = () => {
    // Implement add functionality
  };

  const handleMore = () => {
    // Implement more options functionality
  };

  const handleUserClick = (userId) => {
    // Handle user click
    console.log('User clicked:', userId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {usersList.map((user) => (
          <ListCard
            key={user.id}
            image={user.avatar}
            title={user.name}
            subtitle={user.phone}
            status={user.status}
            onClick={() => handleUserClick(user.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Users;
