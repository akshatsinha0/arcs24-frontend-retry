// src/Components/GeometricStar.jsx
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const GeometricStar = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const sketch = (p) => {
      let points = 12; // Number of points in the star
      let radius = 100; // Reduced radius
      let rotation = 0;
      let rotationSpeed = 0.02; // Increased rotation speed

      p.setup = () => {
        // Reduced canvas size
        p.createCanvas(400, 400);
        p.colorMode(p.HSB, 255); // Using HSB for color variations
      };

      p.draw = () => {
        // Dark background with neon effect
        p.background(10, 10, 30);
        
        // Neon color stroke
        p.strokeWeight(2);
        p.stroke(p.frameCount % 255, 200, 255); // Color changes over time
        
        p.translate(p.width/2, p.height/2);
        rotation += rotationSpeed;
        p.rotate(rotation);
        
        // Draw geometric star pattern
        for (let i = 0; i < points; i++) {
          for (let j = 0; j < points; j++) {
            if (i !== j) {
              let angle1 = p.TWO_PI * i / points;
              let angle2 = p.TWO_PI * j / points;
              
              let x1 = radius * p.cos(angle1);
              let y1 = radius * p.sin(angle1);
              let x2 = radius * p.cos(angle2);
              let y2 = radius * p.sin(angle2);
              
              // Add color variation based on angles
              p.stroke((angle1 * 40) % 255, 200, 255);
              p.line(x1, y1, x2, y2);
            }
          }
        }
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current);
    
    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={canvasRef} className="geometric-star-container"></div>;
};

export default GeometricStar;
