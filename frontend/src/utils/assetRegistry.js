/**
 * Asset Registry
 * Dynamically imports all asset images and provides helper functions to access them.
 */

// Import all PNG images using Vite's glob import
const modules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,svg}', { eager: true });

// Map for quick lookup
const assetMap = {};
const categories = {
    'Ecommerce': [],
    'People': [],
    'Avatars': [],
    'Icons': [],
    'Other': []
};

Object.keys(modules).forEach((path) => {
    const src = modules[path].default;
    // Normalize path to use as key (relative from this file's parent 'src')
    // e.g., "../assets/images/..." -> "/src/assets/images/..." works better for consistency but let's stick to the glob key for uniqueness

    // Store in map
    assetMap[path] = src;

    // Categorize
    const fileName = path.split('/').pop();

    if (path.includes('online-shopping') || path.includes('cooking-food')) {
        categories['Ecommerce'].push({ path, src, name: fileName });
    } else if (path.includes('people-working') || path.includes('character')) {
        categories['People'].push({ path, src, name: fileName });
    } else if (path.includes('Avatar')) {
        categories['Avatars'].push({ path, src, name: fileName });
    } else if (path.includes('Icons') || path.includes('Asset')) {
        categories['Icons'].push({ path, src, name: fileName });
    } else {
        categories['Other'].push({ path, src, name: fileName });
    }
});

/**
 * Get resolved URL for an asset path
 * @param {string} path - The stored path (e.g., from DB)
 * @returns {string} - The resolved URL (hashed in prod, serving path in dev) or original path if external
 */
export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;

    // Check if it matches a key in our map
    if (assetMap[path]) {
        return assetMap[path];
    }

    // Fallback: try to find by fuzzy match if absolute path stored differently
    // e.g., stored "/src/assets/..." but key is "../assets/..."
    const key = Object.keys(assetMap).find(k => k.endsWith(path.split('/').pop()));
    return key ? assetMap[key] : path;
};

/**
 * Get all categorized assets for the picker
 */
export const getCategorizedAssets = () => {
    return categories;
};

export default assetMap;
