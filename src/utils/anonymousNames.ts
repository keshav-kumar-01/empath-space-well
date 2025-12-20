// Generate consistent anonymous display names for group therapy
const anonymousNames = [
  'Brave Soul',
  'Healing Heart',
  'Calm Mind',
  'Gentle Spirit',
  'Rising Phoenix',
  'Peaceful Wave',
  'Hopeful Star',
  'Kind Heart',
  'Strong Oak',
  'Quiet Storm',
  'Warm Light',
  'Free Bird',
  'Tender Bloom',
  'Serene Cloud',
  'Golden Sun',
  'Silver Moon'
];

// Simple hash function for consistent name generation
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Generate a consistent anonymous display name based on user ID and room ID
 * This ensures the same user gets the same name in the same room across sessions
 */
export const getAnonymousName = (userId: string, roomId: string): string => {
  const combinedId = `${userId}-${roomId}`;
  const hash = hashCode(combinedId);
  const nameIndex = Math.abs(hash) % anonymousNames.length;
  const number = (Math.abs(hash) % 99) + 1;
  return `${anonymousNames[nameIndex]} ${number}`;
};

/**
 * Get initials from an anonymous name for avatar display
 */
export const getAnonymousInitials = (displayName: string): string => {
  const words = displayName.split(' ');
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
};

/**
 * Get a color class based on the display name for avatar background
 */
export const getAvatarColor = (displayName: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-rose-500',
    'bg-amber-500'
  ];
  const hash = hashCode(displayName);
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};
