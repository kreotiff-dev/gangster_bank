import React from 'react';
import styles from '../styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashBoard}>
      <div className={styles.balanceInfo}>
        <div className={styles.balance}>Ваш баланс: <br />250,000.00 ₽</div>
        <div className={styles.info}>
          <div className={styles.currentMonth}>Апрель 2023</div>
          <div className={styles.infoItems}>
            <div className={styles.infoItem}>
              <div className={styles.infoContent}>
                <strong>Расходы</strong>
                <br />
                35,000 ₽
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoContent}>
                <strong>Зачисления</strong>
                <br />
                75,000 ₽
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
