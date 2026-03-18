/**
 * Global UI Configuration for Synapse AI
 * Controls feature toggles and quality settings
 */

export const UI_CONFIG = {
  // Manual overrides for testing (leave as null to use hardware detection)
  forceLightMode: null as boolean | null, 
  forceHeavyMode: null as boolean | null,

  // Feature Toggles
  enable3D: true,
  enableParticles: true,
  enableGlassmorphism: true,
  
  // Animation Settings
  gsapDuration: 1.0,
  
  // High-Quality Fallbacks
  fallbacks: {
    useTailwindGlass: true,
    blurStrength: 'backdrop-blur-xl',
  }
};

/**
 * Helper to determine if the device should use 'Heavy' (3D) or 'Light' (2D) UI
 * Takes WebGL support into account
 */
export const getEffectiveUIMode = (hasWebGL: boolean | null) => {
  if (UI_CONFIG.forceLightMode === true) return 'light';
  if (UI_CONFIG.forceHeavyMode === true) return 'heavy';
  
  // Default to light if WebGL is unsupported or still detecting
  if (hasWebGL === false) return 'light';
  
  return 'heavy'; // Standard mode for WebGL-capable devices
};
