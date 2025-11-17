/**
 * Predefined theme templates for place profiles
 * Each theme includes color scheme and button style
 */

export const THEMES = [
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
      linkStyle: 'rounded'
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
      linkStyle: 'pill'
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
      linkStyle: 'rounded'
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
      linkStyle: 'rounded'
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
      linkStyle: 'pill'
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
      linkStyle: 'pill'
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
      linkStyle: 'square'
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
      linkStyle: 'rounded'
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
      linkStyle: 'outline'
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
      linkStyle: 'pill'
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
