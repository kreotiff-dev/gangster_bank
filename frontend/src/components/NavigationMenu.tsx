// NavigationMenu.tsx
import React from 'react';
import UserProfile from './UserProfile';
import styles from './NavigationMenu.module.css';

interface NavigationMenuProps {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        avatar: string;
      };
      balance: number | null;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ user, balance }) => (
  <nav className={styles.menu}>
    <UserProfile user={user} balance={balance} />
    <ul>
      <li><a href="/">Главная</a></li>
      <li><a href="/payments">Платежи</a></li>
      <li><a href="/history">История</a></li>
      <li><a href="/logout">Выход</a></li>
    </ul>
  </nav>
);

export default NavigationMenu;
