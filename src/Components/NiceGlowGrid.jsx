import React, { useEffect } from 'react';
import '../NiceGlowGrid.css';

const GridBackground = () => {
  useEffect(() => {
    const createGrid = () => {
      const gridContainer = document.querySelector('.grid-container');
      if (!gridContainer) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const columns = Math.ceil(viewportWidth / 80);
      const rows = Math.ceil(viewportHeight / 80);
      
      gridContainer.innerHTML = '';
      
      for (let i = 0; i < columns * rows; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
      }
    };

    createGrid();
    window.addEventListener('resize', createGrid);
    return () => window.removeEventListener('resize', createGrid);
  }, []);

  return (
    <>
      <div className="grid-container"></div>
      <div className="flow-light"></div>
    </>
  );
};

export default GridBackground;
