import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button 
        className={styles.button}
        onClick={() => navigate('/')}
      >
        Return Home
      </button>
    </div>
  );
};

export default NotFound;
