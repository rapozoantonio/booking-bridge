import DOMPurify from 'dompurify';

/**
 * Export place data to JSON file
 * @param {Object} placeData - Place data to export
 * @param {string} placeName - Name of the place (for filename)
 */
export function exportPlaceToJSON(placeData, placeName) {
  // Remove sensitive/unnecessary fields
  const exportData = {
    name: placeData.name,
    description: placeData.description,
    bio: placeData.bio,
    location: placeData.location,
    locationMapUrl: placeData.locationMapUrl,
    color: placeData.color,
    backgroundColor: placeData.backgroundColor,
    fontColor: placeData.fontColor,
    buttonTextColor: placeData.buttonTextColor,
    linkStyle: placeData.linkStyle,
    bookingLinks: placeData.bookingLinks || [],
    socialLinks: placeData.socialLinks || [],
    supportLinks: placeData.supportLinks || [],
    showIcons: placeData.showIcons,
    sectionLabels: placeData.sectionLabels || {},
    sectionVisibility: placeData.sectionVisibility || {},
    isActive: placeData.isActive,
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0'
  };

  // Create blob and download
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(placeName || 'place').replace(/\s+/g, '-')}-export-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export place data to CSV file
 * @param {Object} placeData - Place data to export
 * @param {string} placeName - Name of the place (for filename)
 */
export function exportPlaceToCSV(placeData, placeName) {
  // Prepare CSV data
  const rows = [
    ['Link Type', 'Platform', 'Display Name', 'URL', 'Is Active', 'Start Date', 'End Date']
  ];

  // Add booking links
  (placeData.bookingLinks || []).forEach(link => {
    rows.push([
      'Booking',
      link.platform,
      link.displayName || link.platform,
      link.url,
      link.isActive ? 'Yes' : 'No',
      link.startDate || '',
      link.endDate || ''
    ]);
  });

  // Add social links
  (placeData.socialLinks || []).forEach(link => {
    rows.push([
      'Social',
      link.platform,
      link.displayName || link.platform,
      link.url,
      link.isActive ? 'Yes' : 'No',
      link.startDate || '',
      link.endDate || ''
    ]);
  });

  // Add support links
  (placeData.supportLinks || []).forEach(link => {
    rows.push([
      'Support',
      link.platform,
      link.displayName || link.platform,
      link.url,
      link.isActive ? 'Yes' : 'No',
      link.startDate || '',
      link.endDate || ''
    ]);
  });

  // Convert to CSV string
  const csvContent = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(placeName || 'place').replace(/\s+/g, '-')}-links-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitize import data
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeInput(text) {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Import place data from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} Imported and validated place data
 */
export async function importPlaceFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate required fields
        if (!data.name) {
          throw new Error('Import file must contain a "name" field');
        }

        // Sanitize text fields
        const sanitized = {
          name: sanitizeInput(data.name),
          description: data.description ? sanitizeInput(data.description) : '',
          bio: data.bio ? sanitizeInput(data.bio) : '',
          location: data.location ? sanitizeInput(data.location) : '',
          locationMapUrl: data.locationMapUrl && isValidURL(data.locationMapUrl) ? data.locationMapUrl : '',
          color: data.color || '#3B82F6',
          backgroundColor: data.backgroundColor || '#FFFFFF',
          fontColor: data.fontColor || '#000000',
          buttonTextColor: data.buttonTextColor || '#FFFFFF',
          linkStyle: ['rounded', 'pill', 'square', 'outline'].includes(data.linkStyle) ? data.linkStyle : 'rounded',
          bookingLinks: [],
          socialLinks: [],
          supportLinks: [],
          showIcons: data.showIcons !== false,
          sectionLabels: data.sectionLabels || {},
          sectionVisibility: data.sectionVisibility || {},
          isActive: data.isActive !== false
        };

        // Validate and sanitize links
        const validateLinks = (links) => {
          if (!Array.isArray(links)) return [];
          return links
            .filter(link => link.platform && link.url && isValidURL(link.url))
            .map(link => ({
              platform: sanitizeInput(link.platform),
              displayName: link.displayName ? sanitizeInput(link.displayName) : sanitizeInput(link.platform),
              url: link.url,
              isActive: link.isActive !== false,
              icon: link.icon || '',
              showIcon: link.showIcon !== false,
              clicks: 0,
              startDate: link.startDate || null,
              endDate: link.endDate || null
            }));
        };

        sanitized.bookingLinks = validateLinks(data.bookingLinks);
        sanitized.socialLinks = validateLinks(data.socialLinks);
        sanitized.supportLinks = validateLinks(data.supportLinks);

        resolve(sanitized);
      } catch (error) {
        reject(new Error(`Failed to import JSON: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Import links from CSV file
 * @param {File} file - CSV file to import
 * @returns {Promise<Object>} Object with bookingLinks, socialLinks, supportLinks arrays
 */
export async function importLinksFromCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          throw new Error('CSV file must contain at least a header row and one data row');
        }

        // Skip header row
        const dataLines = lines.slice(1);

        const bookingLinks = [];
        const socialLinks = [];
        const supportLinks = [];

        dataLines.forEach((line, index) => {
          // Simple CSV parsing (handles quoted fields)
          const matches = line.match(/("(?:[^"]*(?:"")?)*"|[^,]*)/g);
          if (!matches || matches.length < 4) {
            console.warn(`Skipping invalid line ${index + 2}`);
            return;
          }

          const cells = matches.map(cell => cell.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
          const [linkType, platform, displayName, url, isActive, startDate, endDate] = cells;

          if (!platform || !url || !isValidURL(url)) {
            console.warn(`Skipping invalid link at line ${index + 2}`);
            return;
          }

          const link = {
            platform: sanitizeInput(platform),
            displayName: displayName ? sanitizeInput(displayName) : sanitizeInput(platform),
            url: url,
            isActive: isActive?.toLowerCase() === 'yes',
            icon: '',
            showIcon: true,
            clicks: 0,
            startDate: startDate || null,
            endDate: endDate || null
          };

          const type = linkType?.toLowerCase();
          if (type === 'booking') {
            bookingLinks.push(link);
          } else if (type === 'social') {
            socialLinks.push(link);
          } else if (type === 'support') {
            supportLinks.push(link);
          } else {
            console.warn(`Unknown link type "${linkType}" at line ${index + 2}, defaulting to booking`);
            bookingLinks.push(link);
          }
        });

        resolve({ bookingLinks, socialLinks, supportLinks });
      } catch (error) {
        reject(new Error(`Failed to import CSV: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
