// src/Components/OrbitalCanvas.jsx
import React, { useEffect, useRef } from 'react';


const OrbitalCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import p5 only in browser environment
      import('p5').then((p5Module) => {
        const p5 = p5Module.default;
        
        const sketch = (p) => {
          let time = 0;
          let particles = [];
          let numParticles = 150;
          let harmonics = [];
          let mouseInfluence = 0;
          
          p.setup = function() {
            // Create canvas with appropriate size
            p.createCanvas(400, 400);
            p.colorMode(p.HSB, 255);
            p.background(10, 10, 30);
            
            // Create harmonics for Lissajous patterns
            for (let i = 0; i < 5; i++) {
              harmonics.push({
                freqX: p.random(1, 5),
                freqY: p.random(1, 5),
                phaseX: p.random(p.TWO_PI),
                phaseY: p.random(p.TWO_PI),
                modFreq: p.random(0.001, 0.01),
                amp: p.random(80, 150)
              });
            }
            
            // Initialize particles
            for (let i = 0; i < numParticles; i++) {
              particles.push({
                pos: p.createVector(0, 0),
                prevPos: p.createVector(0, 0),
                harmonic: p.floor(p.random(harmonics.length)),
                t: p.random(100),
                speed: p.random(0.01, 0.05),
                hue: p.random(255),
                size: p.random(1, 3)
              });
            }
          };
          
          p.draw = function() {
            // Create fading effect for trails
            p.fill(10, 10, 30, 15);
            p.noStroke();
            p.rect(0, 0, p.width, p.height);
            
            // Calculate mouse influence
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
              let targetInfluence = p.map(p.dist(p.mouseX, p.mouseY, p.width/2, p.height/2), 0, p.width/2, 0.5, 0);
              mouseInfluence = p.lerp(mouseInfluence, targetInfluence, 0.05);
            } else {
              mouseInfluence = p.lerp(mouseInfluence, 0, 0.05);
            }
            
            // Draw connecting orbits
            p.push();
            p.translate(p.width/2, p.height/2);
            p.noFill();
            
            // Draw base orbital framework
            for (let i = 0; i < 8; i++) {
              let rotation = time * (0.1 + i * 0.01) + i * 0.3;
              p.push();
              p.rotate(rotation);
              p.stroke(i * 30 % 255, 200, 255, 30);
              p.strokeWeight(0.5);
              let size = 100 + i * 15;
              p.ellipse(0, 0, size, size * (0.5 + p.sin(time * 0.2 + i) * 0.2));
              p.pop();
            }
            
            // Draw Lissajous curves framework
            for (let h = 0; h < harmonics.length; h++) {
              let harmonic = harmonics[h];
              p.stroke(h * 50 % 255, 150, 255, 20);
              p.strokeWeight(0.5);
              p.beginShape();
              for (let t = 0; t < p.TWO_PI; t += 0.1) {
                let modT = t + time * harmonic.modFreq;
                let x = p.sin(modT * harmonic.freqX + harmonic.phaseX) * harmonic.amp;
                let y = p.sin(modT * harmonic.freqY + harmonic.phaseY) * harmonic.amp;
                p.vertex(x, y);
              }
              p.endShape(p.CLOSE);
            }
            p.pop();
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
              let particle = particles[i];
              let harmonic = harmonics[particle.harmonic];
              
              // Store previous position for line drawing
              particle.prevPos.x = particle.pos.x;
              particle.prevPos.y = particle.pos.y;
              
              // Update time parameter
              particle.t += particle.speed;
              
              // Calculate new position based on Lissajous pattern
              let modT = particle.t + time * harmonic.modFreq;
              let x = p.sin(modT * harmonic.freqX + harmonic.phaseX) * harmonic.amp;
              let y = p.sin(modT * harmonic.freqY + harmonic.phaseY) * harmonic.amp;
              
              // Add a spiraling effect
              let spiralR = 5 * p.sin(particle.t * 2);
              let spiralT = particle.t * 3;
              x += spiralR * p.cos(spiralT);
              y += spiralR * p.sin(spiralT);
              
              // Apply mouse influence
              if (mouseInfluence > 0) {
                let mx = p.mouseX - p.width/2;
                let my = p.mouseY - p.height/2;
                let d = p.dist(x, y, mx, my);
                if (d < 100) {
                  let f = p.map(d, 0, 100, 0.2, 0) * mouseInfluence;
                  x = p.lerp(x, mx, f);
                  y = p.lerp(y, my, f);
                }
              }
              
              particle.pos.x = x;
              particle.pos.y = y;
              
              // Draw particle trail
              p.push();
              p.translate(p.width/2, p.height/2);
              
              // Calculate dynamic color with time variation
              let hue = (particle.hue + time * 10) % 255;
              let alpha = p.map(p.sin(particle.t * 0.5), -1, 1, 100, 255);
              
              // Draw line connecting previous and current position
              p.stroke(hue, 200, 255, alpha * 0.5);
              p.strokeWeight(particle.size * 0.8);
              p.line(particle.prevPos.x, particle.prevPos.y, particle.pos.x, particle.pos.y);
              
              // Draw particle
              p.noStroke();
              p.fill(hue, 200, 255, alpha);
              let s = particle.size * (1 + p.sin(particle.t) * 0.3);
              
              // Draw different shapes based on particle properties
              if (i % 3 === 0) {
                p.ellipse(particle.pos.x, particle.pos.y, s, s);
              } else if (i % 3 === 1) {
                p.rect(particle.pos.x, particle.pos.y, s, s);
              } else {
                p.push();
                p.translate(particle.pos.x, particle.pos.y);
                p.rotate(particle.t);
                p.triangle(0, -s, s/2, s/2, -s/2, s/2);
                p.pop();
              }
              p.pop();
            }
            
            // Create glowing center effect
            p.push();
            p.translate(p.width/2, p.height/2);
            for (let i = 5; i > 0; i--) {
              let alpha = p.map(i, 5, 0, 30, 150);
              let size = p.map(i, 5, 0, 50, 10);
              let pulse = p.sin(time * 2) * 10;
              p.noStroke();
              p.fill(210, 200, 255, alpha);
              p.ellipse(0, 0, size + pulse, size + pulse);
            }
            p.pop();
            
            // Create pulsing edge effect
            p.push();
            let edgePulse = p.map(p.sin(time), -1, 1, 0, 20);
            p.noFill();
            p.strokeWeight(2);
            p.stroke(180, 150, 255, 50);
            p.translate(p.width/2, p.height/2);
            let s = Math.min(p.width, p.height) * 0.9 - edgePulse;
            p.rotate(time * 0.1);
            p.beginShape();
            for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / 4) {
              let r = s/2 + p.sin(a * 3 + time) * 20;
              let x = r * p.cos(a);
              let y = r * p.sin(a);
              p.curveVertex(x, y);
            }
            p.endShape(p.CLOSE);
            p.pop();
            
            time += 0.01;
          };
          
          // Add mouse interaction
          p.mouseMoved = function() {
            // Additional mouse interaction if needed
          };
        };
        
        const p5Instance = new p5(sketch, canvasRef.current);
        
        return () => {
          p5Instance.remove();
        };
      });
    }
  }, []);

  return (
    <div className="orbital-canvas-container">
      <div ref={canvasRef} className="orbital-canvas"></div>
    </div>
  );
};

export default OrbitalCanvas;
