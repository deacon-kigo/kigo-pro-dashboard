/**
 * Avatar Utilities
 * 
 * Functions for generating SVG avatars based on user initials
 */

interface AvatarOptions {
  size?: number;
  fontSize?: number;
  fontWeight?: string;
  backgroundColor?: string;
  textColor?: string;
  rounded?: boolean;
}

/**
 * Generate a deterministic color from a string
 * Will always return the same color for the same input
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use HSL to ensure colors are vibrant but not too light
  const h = Math.abs(hash % 360);
  const s = 60 + (hash % 20); // 60-80%
  const l = 45 + (hash % 10); // 45-55%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Generate a contrasting text color (black or white) based on background
 */
export function getContrastColor(hexColor: string): string {
  // For HSL colors, we can just use the lightness
  if (hexColor.startsWith('hsl')) {
    const lightnessMatch = hexColor.match(/(\d+)%\)/);
    if (lightnessMatch && lightnessMatch[1]) {
      const lightness = parseInt(lightnessMatch[1], 10);
      return lightness > 50 ? '#000000' : '#FFFFFF';
    }
  }
  
  // Default to white
  return '#FFFFFF';
}

/**
 * Generate initials from a full name
 */
export function getInitials(fullName: string): string {
  if (!fullName) return '';
  
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate an SVG data URL for an avatar with initials
 */
export function generateInitialsAvatar(
  fullName: string,
  options: AvatarOptions = {}
): string {
  const {
    size = 200,
    fontSize = size / 2.5,
    fontWeight = 'bold',
    backgroundColor,
    textColor,
    rounded = true
  } = options;
  
  const initials = getInitials(fullName);
  
  // Generate a deterministic color if none provided
  const bgColor = backgroundColor || stringToColor(fullName);
  const txtColor = textColor || getContrastColor(bgColor);
  
  // Create SVG
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${bgColor}" rx="${rounded ? size / 2 : 0}" ry="${rounded ? size / 2 : 0}" />
      <text x="50%" y="50%" dy=".1em" fill="${txtColor}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle" dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `;
  
  // Convert to data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate a mock avatar URL for a user
 */
export function getMockAvatarUrl(userProfile: { firstName: string; lastName: string; id: string }): string {
  // First try to use a real image URL with the user's ID
  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
  
  // Generate a data URL with the SVG avatar
  return generateInitialsAvatar(fullName, {
    size: 200,
    backgroundColor: stringToColor(userProfile.id || fullName)
  });
} 