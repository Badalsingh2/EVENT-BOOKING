"use client"

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const ctx = context as CanvasRenderingContext2D;
    let animationFrameId: number;

    // Set canvas dimensions to match window
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas dimensions
    setCanvasDimensions();
    
    // Update dimensions on resize
    window.addEventListener('resize', setCanvasDimensions);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      connections: Array<{particle: Particle, distance: number}>;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.1;
        this.connections = [];
      }
      
      getRandomColor() {
        const colors = [
          'rgba(99, 102, 241, alpha)', // indigo
          'rgba(59, 130, 246, alpha)', // blue
          'rgba(139, 92, 246, alpha)', // purple
          'rgba(79, 70, 229, alpha)'   // indigo-blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges with some randomness
        if(this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX * 0.9;
          this.speedX += (Math.random() * 0.2 - 0.1);
        }
        if(this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY * 0.9;
          this.speedY += (Math.random() * 0.2 - 0.1);
        }
        
        // Slow drag effect
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Add subtle movement even when nearly stopped
        if(Math.abs(this.speedX) < 0.05) this.speedX += (Math.random() * 0.1 - 0.05) * 0.1;
        if(Math.abs(this.speedY) < 0.05) this.speedY += (Math.random() * 0.1 - 0.05) * 0.1;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        // Draw particle with glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0, 
          this.x, this.y, this.size * 3
        );
        
        const colorWithOpacity = this.color.replace('alpha', this.opacity.toString());
        const colorTransparent = this.color.replace('alpha', '0');
        
        gradient.addColorStop(0, colorWithOpacity);
        gradient.addColorStop(1, colorTransparent);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      findConnections(particles: Particle[]) {
        this.connections = [];
        particles.forEach(particle => {
          if(particle === this) return;
          
          const distance = Math.sqrt(
            Math.pow(this.x - particle.x, 2) + 
            Math.pow(this.y - particle.y, 2)
          );
          
          if(distance < 150) {
            this.connections.push({
              particle: particle,
              distance: distance
            });
          }
        });
      }
      
      drawConnections(ctx: CanvasRenderingContext2D) {
        this.connections.forEach(connection => {
          const lineOpacity = 0.5 - (connection.distance / 150);
          if(lineOpacity <= 0) return;
          
          ctx.beginPath();
          ctx.strokeStyle = this.color.replace('alpha', (lineOpacity * 0.5).toString());
          ctx.lineWidth = this.size * 0.2;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(connection.particle.x, connection.particle.y);
          ctx.stroke();
        });
      }
    }

    // Create particles
    const particleCount = Math.min(Math.max(window.innerWidth * 0.08, 30), 150);
    const particles: Particle[] = [];
    for(let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }

    // Mouse interaction
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150
    };

    canvas.addEventListener('mousemove', function(event: MouseEvent) {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    canvas.addEventListener('mouseout', function() {
      mouse.x = null;
      mouse.y = null;
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas);
        
        // Mouse interaction
        if(mouse.x !== null && mouse.y !== null) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if(distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            particle.speedX += forceDirectionX * force * 0.2;
            particle.speedY += forceDirectionY * force * 0.2;
          }
        }
        
        // Find connections between particles
        particle.findConnections(particles);
      });
      
      // Draw connections first (behind particles)
      particles.forEach(particle => {
        particle.drawConnections(ctx);
      });
      
      // Then draw particles on top
      particles.forEach(particle => {
        particle.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        opacity: 0.7,
        mixBlendMode: 'screen'
      }}
    />
  );
}