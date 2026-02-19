/**
 * Date formatting utilities to ensure consistent formatting across server and client
 * This prevents hydration mismatches by using a consistent format
 */

/**
 * Formats a date string or Date object to a consistent format (DD/MM/YYYY)
 * Uses manual formatting to avoid locale differences between server and client
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    
    // Manual formatting to ensure consistency (DD/MM/YYYY)
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Invalid Date";
  }
}

/**
 * Formats a date with time
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    
    // Manual formatting for consistency
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return "Invalid Date";
  }
}

/**
 * Formats a date with full details (e.g., "Monday, 15 December 2024")
 * Uses en-ZA locale for consistent formatting
 */
export function formatDateFull(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    
    // Use explicit locale to ensure consistency
    return dateObj.toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
}

/**
 * Formats a date for display in tables (short format)
 */
export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    
    // Manual formatting for consistency
    const day = String(dateObj.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    return "Invalid Date";
  }
}

