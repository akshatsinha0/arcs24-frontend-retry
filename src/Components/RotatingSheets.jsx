// src/Components/RotatingSheets.jsx
import React, { useEffect, useRef } from 'react';

const RotatingSheets = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    let sheetHistory = []; // Array to store previous positions
    let maxHistory = 20;   // How many previous positions to remember (trail length)
    
    // Only run p5 code on the client side
    if (typeof window !== 'undefined') {
      // Dynamically import p5
      import('p5').then((p5Module) => {
        const p5 = p5Module.default;
        
        const sketch = (p) => {
          p.setup = function() {
            p.createCanvas(300, 300);
            p.rectMode(p.CENTER);
          };
          
          p.draw = function() {
            // Semi-transparent background for fading effect
            p.fill(45, 65, 85, 20); // Dark blue with transparency
            p.rect(p.width/2, p.height/2, p.width, p.height);
            
            // Store current mouse position with current frame count
            if (p.mouseX !== 0 || p.mouseY !== 0) { // Only add when mouse has moved
              sheetHistory.push({
                x: p.mouseX * 0.3, // Scale to top-left (multiply by factor < 1)
                y: p.mouseY * 0.3, // Scale to top-left (multiply by factor < 1)
                angle: p.frameCount * 0.02 // Continuous rotation
              });
            }
            
            // Limit the history array length
            if (sheetHistory.length > maxHistory) {
              sheetHistory.shift(); // Remove oldest position
            }
            
            // Draw all stacks in history with fading opacity
            for (let i = 0; i < sheetHistory.length; i++) {
              let pos = sheetHistory[i];
              let opacity = p.map(i, 0, sheetHistory.length - 1, 255, 50); // Fade out older positions
              
              drawStack(pos.x, pos.y, pos.angle, opacity);
            }
          };
          
          function drawStack(x, y, angle, opacity) {
            p.push();
            p.translate(x, y);
            p.rotate(angle); // Rotate the entire stack
            
            // Draw multiple sheets
            let sheets = 10;
            for (let i = 0; i < sheets; i++) {
              p.fill(255, 255, 255, opacity - (i * 15)); // Decreasing opacity for each sheet
              p.stroke(200, opacity - (i * 15));
              p.strokeWeight(1);
              
              // Small size to fit in top-left area
              p.rect(0, 0, 100 - i*4, 130 - i*4, 5);
              
              // Add slight variation to each sheet
              p.rotate(p.sin(p.frameCount * 0.01 + i * 0.2) * 0.05);
            }
            p.pop();
          }
        };
        
        const p5Instance = new p5(sketch, canvasRef.current);
        
        // Cleanup function
        return () => {
          p5Instance.remove();
        };
      });
    }
  }, []);

  return <div ref={canvasRef} className="rotating-sheets-container"></div>;
};

export default RotatingSheets;
