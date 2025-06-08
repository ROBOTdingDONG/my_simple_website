/**
 * Pulse Wave Animated Background Component
 * Professional implementation with performance optimizations
 * Integrates seamlessly with existing website structure
 */

class PulseWaveBackground {
    constructor(containerId = 'animated-background') {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isVisible = true;
        this.performanceMode = false;
        
        // Animation state
        this.mouse = { x: 0, y: 0 };
        this.dots = [];
        this.pulseOffset = 0;
        
        // Configuration
        this.config = {
            dotCount: window.innerWidth < 768 ? 60 : 120, // Reduce on mobile
            maxRadius: 400,
            baseRadius: 80,
            pulseSpeed: 0.02,
            interactionRadius: 60,
            attractionStrength: 12,
            connectionDistance: 80,
            colors: {
                primary: '#00ff88',
                interaction: '#00aaff',
                background: 'rgba(0, 0, 0, 0.05)'
            }
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createDots();
        this.start();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pulse-wave-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    setupEventListeners() {
        // Resize handler with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.createDots(); // Recreate dots for new dimensions
            }, 250);
        });
        
        // Mouse movement with throttling for performance
        let mouseThrottle = false;
        document.addEventListener('mousemove', (e) => {
            if (!mouseThrottle) {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                mouseThrottle = true;
                setTimeout(() => mouseThrottle = false, 16); // ~60fps
            }
        });
        
        // Visibility API for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addListener((e) => {
            if (e.matches) {
                this.enablePerformanceMode();
            } else {
                this.disablePerformanceMode();
            }
        });
        
        if (mediaQuery.matches) {
            this.enablePerformanceMode();
        }
    }
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        // Update dot count based on screen size
        this.config.dotCount = window.innerWidth < 768 ? 60 : 
                               window.innerWidth < 1200 ? 90 : 120;
    }
    
    createDots() {
        this.dots = [];
        const centerX = this.canvas.width / (window.devicePixelRatio || 1) / 2;
        const centerY = this.canvas.height / (window.devicePixelRatio || 1) / 2;
        
        for (let i = 0; i < this.config.dotCount; i++) {
            const angle = (i / this.config.dotCount) * Math.PI * 2;
            const radius = this.config.baseRadius + (i % 5) * 40;
            
            this.dots.push({
                angle: angle,
                baseRadius: radius,
                radius: radius,
                x: 0,
                y: 0,
                size: 2 + Math.random() * 2,
                pulsePhase: Math.random() * Math.PI * 2,
                interactionTime: 0,
                isInteracting: false,
                lastUpdate: performance.now()
            });
        }
    }
    
    animate() {
        if (!this.isVisible) return;
        
        const now = performance.now();
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        // Clear canvas with fade effect
        this.ctx.fillStyle = this.config.colors.background;
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        this.pulseOffset += this.config.pulseSpeed;
        
        // Update and draw dots
        this.dots.forEach((dot, index) => {
            this.updateDot(dot, centerX, centerY, now);
            this.drawDot(dot, index);
        });
        
        // Draw connections if not in performance mode
        if (!this.performanceMode) {
            this.drawConnections();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateDot(dot, centerX, centerY, now) {
        // Calculate base position with pulse
        const basePulse = Math.sin(this.pulseOffset + dot.pulsePhase) * 15;
        const currentRadius = dot.baseRadius + basePulse;
        
        let dotX = centerX + Math.cos(dot.angle) * currentRadius;
        let dotY = centerY + Math.sin(dot.angle) * currentRadius;
        
        // Mouse interaction with performance optimization
        if (!this.performanceMode) {
            const dotDistance = Math.sqrt(
                Math.pow(this.mouse.x - dotX, 2) + Math.pow(this.mouse.y - dotY, 2)
            );
            
            if (dotDistance < this.config.interactionRadius && dotDistance > 0) {
                const influence = (this.config.interactionRadius - dotDistance) / this.config.interactionRadius;
                const attractionStrength = influence * this.config.attractionStrength;
                
                if (!dot.isInteracting) {
                    dot.isInteracting = true;
                    dot.interactionTime = 180;
                }
                
                const dx = this.mouse.x - dotX;
                const dy = this.mouse.y - dotY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                dotX += (dx / distance) * attractionStrength;
                dotY += (dy / distance) * attractionStrength;
            }
        }
        
        // Handle interaction timer
        if (dot.isInteracting) {
            dot.interactionTime--;
            if (dot.interactionTime <= 0) {
                dot.isInteracting = false;
            }
        }
        
        dot.x = dotX;
        dot.y = dotY;
        dot.lastUpdate = now;
    }
    
    drawDot(dot) {
        const pulseAlpha = 0.3 + Math.sin(this.pulseOffset * 2 + dot.pulsePhase) * 0.4;
        let dotColor = this.config.colors.primary;
        
        // Color transition for interaction
        if (dot.isInteracting) {
            const progress = dot.interactionTime / 180;
            if (progress > 0.7) {
                dotColor = this.config.colors.interaction;
            } else {
                const fadeProgress = progress / 0.7;
                dotColor = this.interpolateColor(
                    this.config.colors.interaction,
                    this.config.colors.primary,
                    1 - fadeProgress
                );
            }
        }
        
        this.ctx.save();
        this.ctx.globalAlpha = pulseAlpha;
        this.ctx.fillStyle = dotColor;
        this.ctx.shadowColor = dotColor;
        this.ctx.shadowBlur = 6;
        
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawConnections() {
        this.dots.forEach((dot, index) => {
            this.dots.forEach((otherDot, otherIndex) => {
                if (index < otherIndex) {
                    const distance = Math.sqrt(
                        Math.pow(dot.x - otherDot.x, 2) + 
                        Math.pow(dot.y - otherDot.y, 2)
                    );
                    
                    if (distance < this.config.connectionDistance) {
                        let lineColor = this.config.colors.primary;
                        
                        if (dot.isInteracting || otherDot.isInteracting) {
                            lineColor = dot.isInteracting ? 
                                (dot.interactionTime > 126 ? this.config.colors.interaction : this.config.colors.primary) :
                                (otherDot.interactionTime > 126 ? this.config.colors.interaction : this.config.colors.primary);
                        }
                        
                        this.ctx.save();
                        this.ctx.globalAlpha = (this.config.connectionDistance - distance) / this.config.connectionDistance * 0.2;
                        this.ctx.strokeStyle = lineColor;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(dot.x, dot.y);
                        this.ctx.lineTo(otherDot.x, otherDot.y);
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                }
            });
        });
    }
    
    interpolateColor(color1, color2, factor) {
        // Simple color interpolation for smooth transitions
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Enable performance mode if FPS drops below 30
                if (fps < 30 && !this.performanceMode) {
                    console.warn('PulseWave: Enabling performance mode due to low FPS');
                    this.enablePerformanceMode();
                }
            }
            
            if (this.isVisible) {
                requestAnimationFrame(checkPerformance);
            }
        };
        
        checkPerformance();
    }
    
    enablePerformanceMode() {
        this.performanceMode = true;
        this.config.dotCount = Math.min(this.config.dotCount, 40);
        this.createDots();
    }
    
    disablePerformanceMode() {
        this.performanceMode = false;
        this.config.dotCount = window.innerWidth < 768 ? 60 : 120;
        this.createDots();
    }
    
    start() {
        this.isVisible = true;
        this.animate();
    }
    
    pause() {
        this.isVisible = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    resume() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    
    // Public API for customization
    setColors(primary, interaction, background) {
        this.config.colors.primary = primary || this.config.colors.primary;
        this.config.colors.interaction = interaction || this.config.colors.interaction;
        this.config.colors.background = background || this.config.colors.background;
    }
    
    setDotCount(count) {
        this.config.dotCount = count;
        this.createDots();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if the animated background container exists
    const backgroundContainer = document.getElementById('animated-background');
    if (backgroundContainer) {
        window.pulseWave = new PulseWaveBackground();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PulseWaveBackground;
}
