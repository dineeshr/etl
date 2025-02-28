// src/MenuButton/OpenMenuButton.js

import React from 'react';
import { Button } from 'react-bootstrap';

const OpenMenuButton = ({ handleDrawerToggle }) => {
  return (
    <Button onClick={handleDrawerToggle}>
      Open Menu
    </Button>
  );
};

export default OpenMenuButton;
