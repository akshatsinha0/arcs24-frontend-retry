// src/Components/GreenFountain.jsx
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const GreenFountain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const sketch = (p) => {
      let points = [];
      let numPoints = 80;
      let centerX, centerY;
      let easing = 0.05;
      let particleSystem = [];
      let maxParticles = 500;

      p.setup = () => {
        p.createCanvas(400, 400); // Reduced size
        p.colorMode(p.HSB, 255); // Using HSB for color transitions
        p.rectMode(p.CENTER);
        
        centerX = p.width/2;
        centerY = p.height/2;
        
        // Create points with varied properties
        for (let i = 0; i < numPoints; i++) {
          points.push({
            angle: p.random(p.TWO_PI),
            radius: p.random(30, 120),
            size: p.random(4, 12),
            speed: p.random(0.01, 0.03),
            hue: p.random(255)
          });
        }
      };

      p.draw = () => {
        p.background(0, 0, 25); // Dark background
        
        // Update center position with mouse interaction
        let targetX = p.mouseX;
        let targetY = p.mouseY;
        centerX = p.lerp(centerX, targetX, easing);
        centerY = p.lerp(centerY, targetY, easing);
        
        // Calculate mouse speed for dynamic effects
        let mouseSpeed = p.dist(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        
        // Draw organic connections
        p.strokeWeight(1);
        for (let i = 0; i < numPoints; i++) {
          let point = points[i];
          let x = centerX + p.cos(point.angle + p.frameCount * point.speed) * point.radius;
          let y = centerY + p.sin(point.angle + p.frameCount * point.speed) * point.radius;
          
          // Dynamic color based on position and motion
          let hue = (point.hue + p.frameCount * 0.5) % 255;
          let sat = p.map(y, 0, p.height, 150, 255);
          let bri = p.map(x, 0, p.width, 150, 255);
          
          // Draw glowing lines
          p.stroke(hue, sat, bri, 50);
          p.line(centerX, centerY, x, y);
          
          // Draw organic shapes instead of circles
          p.push();
          p.translate(x, y);
          p.rotate(p.frameCount * 0.01);
          p.noStroke();
          p.fill(hue, sat, bri, 200);
          
          // Shape variation
          if (i % 4 === 0) {
            p.rect(0, 0, point.size * 1.5, point.size * 1.5);
          } else if (i % 3 === 0) {
            p.triangle(
              -point.size, point.size,
              point.size, point.size,
              0, -point.size
            );
          } else {
            p.ellipse(0, 0, point.size * 2);
          }
          p.pop();
          
          // Add particle effects
          if (p.frameCount % 2 === 0) {
            particleSystem.push({
              pos: p.createVector(x, y),
              vel: p.createVector(p.random(-1, 1), p.random(-1, 1)),
              life: 255,
              hue: hue,
              size: point.size * 0.5
            });
          }
        }
        
        // Update and draw particles
        for (let i = particleSystem.length - 1; i >= 0; i--) {
          let part = particleSystem[i];
          part.pos.add(part.vel);
          part.life -= 3;
          part.size *= 0.98;
          
          p.noStroke();
          p.fill(part.hue, 200, 255, part.life);
          p.ellipse(part.pos.x, part.pos.y, part.size);
          
          if (part.life <= 0) {
            particleSystem.splice(i, 1);
          }
        }
        
        // Maintain particle count
        if (particleSystem.length > maxParticles) {
          particleSystem.splice(0, particleSystem.length - maxParticles);
        }
        
        // Add central glow effect
        p.noStroke();
        for (let i = 0; i < 3; i++) {
          p.fill(255, 50 * (3 - i));
          p.ellipse(centerX, centerY, 50 * (3 - i));
        }
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current);
    
    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={canvasRef} className="green-fountain-container"></div>;
};

export default GreenFountain;
