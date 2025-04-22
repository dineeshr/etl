// src/MenuButton/OpenMenuButton.js

import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../css/OpenMenuButton.module.css'; // Import the CSS module

const OpenMenuButton = ({ handleDrawerToggle }) => {
  return (
    <Button onClick={handleDrawerToggle} className={styles.button}>
      Open Menu
    </Button>
  );
};

export default OpenMenuButton;
