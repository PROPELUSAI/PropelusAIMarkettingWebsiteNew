/**
 * Permissions Utility — Role-based access control (RBAC) for the blog module.
 * Defines three roles (admin, editor, viewer) with granular permissions
 * for create, edit, delete, publish, manage categories/tags, and view analytics.
 * Exported helpers (canUserEdit, canUserDelete, etc.) are used by BlogList,
 * BlogDetail, and BlogForm to conditionally show/hide action buttons.
 */

// Blog Permissions Helper
// This utility helps manage user permissions for the blog module

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const BLOG_PERMISSIONS = {
  // Admin permissions
  [USER_ROLES.ADMIN]: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canPublish: true,
    canViewAll: true,
    canViewAnalytics: true,
    canViewAuditLog: true
  },
  
  // Editor permissions
  [USER_ROLES.EDITOR]: {
    canCreate: true,
    canEdit: true, // Only own blogs
    canDelete: false,
    canApprove: false,
    canPublish: false,
    canViewAll: false, // Only own blogs
    canViewAnalytics: true, // Only own blogs
    canViewAuditLog: false
  },
  
  // Viewer permissions
  [USER_ROLES.VIEWER]: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: false,
    canPublish: false,
    canViewAll: true, // Only published
    canViewAnalytics: false,
    canViewAuditLog: false
  }
};

/**
 * Check if user has permission for an action
 * @param {string} userRole - User's role (admin, editor, viewer)
 * @param {string} permission - Permission to check
 * @param {object} blog - Blog object (optional, for ownership checks)
 * @param {string} userId - Current user ID (optional, for ownership checks)
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission, blog = null, userId = null) => {
  const permissions = BLOG_PERMISSIONS[userRole];
  
  if (!permissions) {
    return false;
  }
  
  // Check basic permission
  const hasBasicPermission = permissions[permission];
  
  // For editors, check ownership for edit/view permissions
  if (userRole === USER_ROLES.EDITOR && blog && userId) {
    if (permission === 'canEdit' || permission === 'canViewAnalytics') {
      return hasBasicPermission && blog.author_id === userId;
    }
  }
  
  return hasBasicPermission;
};

/**
 * Get user role from user metadata or profile
 * This is a placeholder - implement based on your auth system
 * @param {object} user - User object from Supabase auth
 * @returns {string}
 */
export const getUserRole = (user) => {
  // Option 1: From user metadata
  if (user?.user_metadata?.role) {
    return user.user_metadata.role;
  }
  
  // Option 2: From email domain (example)
  if (user?.email?.endsWith('@yourdomain.com')) {
    return USER_ROLES.ADMIN;
  }
  
  // Option 3: From database profile table
  // You would need to fetch this from your profiles table
  
  // Default to viewer
  return USER_ROLES.VIEWER;
};

/**
 * Filter blogs based on user role
 * @param {array} blogs - Array of blog objects
 * @param {string} userRole - User's role
 * @param {string} userId - Current user ID
 * @returns {array}
 */
export const filterBlogsByPermission = (blogs, userRole, userId) => {
  if (userRole === USER_ROLES.ADMIN) {
    return blogs; // Admins see all
  }
  
  if (userRole === USER_ROLES.EDITOR) {
    return blogs.filter(blog => blog.author_id === userId); // Editors see only their own
  }
  
  if (userRole === USER_ROLES.VIEWER) {
    return blogs.filter(blog => blog.status === 'published'); // Viewers see only published
  }
  
  return [];
};

/**
 * Get available actions for a blog based on user role
 * @param {object} blog - Blog object
 * @param {string} userRole - User's role
 * @param {string} userId - Current user ID
 * @returns {object}
 */
export const getAvailableActions = (blog, userRole, userId) => {
  const isOwner = blog.author_id === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;
  
  return {
    canView: true, // Everyone can view if they have access to the blog
    canEdit: isAdmin || (userRole === USER_ROLES.EDITOR && isOwner),
    canDelete: isAdmin,
    canApprove: isAdmin && blog.status === 'pending',
    canReject: isAdmin && blog.status === 'pending',
    canPublish: isAdmin && ['draft', 'approved'].includes(blog.status),
    canUnpublish: isAdmin && blog.status === 'published',
    canArchive: isAdmin,
    canFeature: isAdmin,
    canSubmitForApproval: (isAdmin || (userRole === USER_ROLES.EDITOR && isOwner)) && blog.status === 'draft'
  };
};

// Example usage in components:
/*
import { hasPermission, getUserRole, getAvailableActions } from '../utils/permissions';

// In your component:
const user = useAuth(); // Your auth hook
const userRole = getUserRole(user);

// Check if user can create blogs
if (hasPermission(userRole, 'canCreate')) {
  // Show create button
}

// Get available actions for a specific blog
const actions = getAvailableActions(blog, userRole, user.id);
if (actions.canEdit) {
  // Show edit button
}
*/
