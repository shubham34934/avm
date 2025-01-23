import { useNavigate } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <button 
        className={styles.button}
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorized;
