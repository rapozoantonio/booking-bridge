/**
 * Predefined theme templates for place profiles
 * Enhanced with 2025 cutting-edge design features
 */

export const THEMES = [
  // Classic Themes (Enhanced)
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Professional and trustworthy',
    preview: {
      primary: '#3B82F6',
      secondary: '#60A5FA'
    },
    settings: {
      color: '#3B82F6',
      backgroundColor: '#FFFFFF',
      fontColor: '#000000',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'rounded',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Luxurious and sophisticated',
    preview: {
      primary: '#9333EA',
      secondary: '#A855F7'
    },
    settings: {
      color: '#9333EA',
      backgroundColor: '#FFFFFF',
      fontColor: '#1F2937',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    description: 'Fresh and eco-friendly',
    preview: {
      primary: '#10B981',
      secondary: '#34D399'
    },
    settings: {
      color: '#10B981',
      backgroundColor: '#F0FDF4',
      fontColor: '#064E3B',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'rounded',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm and inviting',
    preview: {
      primary: '#F59E0B',
      secondary: '#FBBF24'
    },
    settings: {
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
      fontColor: '#78350F',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'rounded',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    description: 'Calm and refreshing',
    preview: {
      primary: '#14B8A6',
      secondary: '#2DD4BF'
    },
    settings: {
      color: '#14B8A6',
      backgroundColor: '#F0FDFA',
      fontColor: '#134E4A',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    description: 'Romantic and charming',
    preview: {
      primary: '#EC4899',
      secondary: '#F472B6'
    },
    settings: {
      color: '#EC4899',
      backgroundColor: '#FDF2F8',
      fontColor: '#831843',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    description: 'Modern and sleek',
    preview: {
      primary: '#1F2937',
      secondary: '#374151'
    },
    settings: {
      color: '#1F2937',
      backgroundColor: '#F9FAFB',
      fontColor: '#111827',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'square',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'ruby-red',
    name: 'Ruby Red',
    description: 'Bold and energetic',
    preview: {
      primary: '#DC2626',
      secondary: '#EF4444'
    },
    settings: {
      color: '#DC2626',
      backgroundColor: '#FEF2F2',
      fontColor: '#7F1D1D',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'rounded',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple',
    preview: {
      primary: '#000000',
      secondary: '#6B7280'
    },
    settings: {
      color: '#000000',
      backgroundColor: '#FFFFFF',
      fontColor: '#000000',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'outline',
      buttonEffect: 'outline',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    description: 'Light and airy',
    preview: {
      primary: '#0EA5E9',
      secondary: '#38BDF8'
    },
    settings: {
      color: '#0EA5E9',
      backgroundColor: '#F0F9FF',
      fontColor: '#0C4A6E',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'solid',
      backgroundPattern: 'none'
    }
  },

  // NEW 2025 MODERN THEMES
  {
    id: 'glassmorphism-light',
    name: 'Glass Light',
    description: '✨ Frosted glass elegance',
    tag: 'NEW',
    preview: {
      primary: '#6366F1',
      secondary: '#A78BFA'
    },
    settings: {
      color: '#6366F1',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontColor: '#1F2937',
      buttonTextColor: '#1F2937',
      linkStyle: 'rounded',
      buttonEffect: 'glass',
      backgroundPattern: 'gradient',
      backdropBlur: true
    }
  },
  {
    id: 'glassmorphism-dark',
    name: 'Glass Dark',
    description: '✨ Dark frosted sophistication',
    tag: 'NEW',
    preview: {
      primary: '#818CF8',
      secondary: '#C4B5FD'
    },
    settings: {
      color: '#818CF8',
      backgroundColor: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
      fontColor: '#FFFFFF',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'rounded',
      buttonEffect: 'glass',
      backgroundPattern: 'gradient',
      backdropBlur: true
    }
  },
  {
    id: 'gradient-mesh',
    name: 'Mesh Gradient',
    description: '🎨 Vibrant mesh patterns',
    tag: 'NEW',
    preview: {
      primary: '#F472B6',
      secondary: '#A78BFA'
    },
    settings: {
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundColor: '#FFFFFF',
      fontColor: '#1F2937',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'gradient',
      backgroundPattern: 'mesh',
      gradientButton: true
    }
  },
  {
    id: 'neumorphic-light',
    name: 'Neomorphic',
    description: '🔘 Soft 3D depth',
    tag: 'NEW',
    preview: {
      primary: '#6366F1',
      secondary: '#8B9DC3'
    },
    settings: {
      color: '#6366F1',
      backgroundColor: '#E0E5EC',
      fontColor: '#2D3748',
      buttonTextColor: '#2D3748',
      linkStyle: 'rounded',
      buttonEffect: 'neumorphic',
      backgroundPattern: 'none'
    }
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora',
    description: '🌌 Northern lights magic',
    tag: 'NEW',
    preview: {
      primary: '#10B981',
      secondary: '#3B82F6'
    },
    settings: {
      color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
      backgroundColor: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
      fontColor: '#1F2937',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'glass',
      backgroundPattern: 'aurora',
      gradientButton: true
    }
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic',
    description: '🌠 Deep space vibes',
    tag: 'NEW',
    preview: {
      primary: '#8E2DE2',
      secondary: '#4A00E0'
    },
    settings: {
      color: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
      backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontColor: '#FFFFFF',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'rounded',
      buttonEffect: 'gradient',
      backgroundPattern: 'stars',
      gradientButton: true
    }
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Glow',
    description: '🌅 Warm gradient vibes',
    tag: 'NEW',
    preview: {
      primary: '#FF6B6B',
      secondary: '#FFE66D'
    },
    settings: {
      color: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      backgroundColor: 'linear-gradient(135deg, #FFF5F7 0%, #FFFBEA 100%)',
      fontColor: '#78350F',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'pill',
      buttonEffect: 'gradient',
      backgroundPattern: 'gradient',
      gradientButton: true
    }
  },
  {
    id: 'monochrome-premium',
    name: 'Monochrome Pro',
    description: '⚫ Ultra-minimal luxury',
    tag: 'PREMIUM',
    preview: {
      primary: '#000000',
      secondary: '#404040'
    },
    settings: {
      color: '#000000',
      backgroundColor: '#FAFAFA',
      fontColor: '#000000',
      buttonTextColor: '#FFFFFF',
      linkStyle: 'square',
      buttonEffect: 'solid',
      backgroundPattern: 'subtle-grid'
    }
  }
];

/**
 * Apply a theme to form data
 * @param {Object} currentFormData - Current form data
 * @param {string} themeId - Theme ID to apply
 * @returns {Object} Updated form data with theme applied
 */
export function applyTheme(currentFormData, themeId) {
  const theme = THEMES.find(t => t.id === themeId);

  if (!theme) {
    console.warn(`Theme "${themeId}" not found`);
    return currentFormData;
  }

  return {
    ...currentFormData,
    ...theme.settings
  };
}

/**
 * Get theme by ID
 * @param {string} themeId - Theme ID
 * @returns {Object|null} Theme object or null if not found
 */
export function getThemeById(themeId) {
  return THEMES.find(t => t.id === themeId) || null;
}
