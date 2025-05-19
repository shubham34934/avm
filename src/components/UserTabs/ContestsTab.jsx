import styles from './UserTabs.module.css';

const ContestsTab = ({ user }) => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Contests Participated</h3>
      </div>
      <div className={styles.contestsGrid}>
        {user?.contests?.length > 0 ? (
          user.contests.map((contest, index) => (
            <div key={index} className={styles.contestCard}>
              <div className={styles.contestInfo}>
                <h4>{contest.name}</h4>
                <p>{contest.description}</p>
                <div className={styles.contestStats}>
                  <span>Status: {contest.status}</span>
                  <span>Rank: {contest.rank || 'N/A'}</span>
                  <span>Prize: {contest.prize || 'N/A'}</span>
                  <span>Participated: {new Date(contest.participationDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noContests}>
            <p>No contests participated yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestsTab; 