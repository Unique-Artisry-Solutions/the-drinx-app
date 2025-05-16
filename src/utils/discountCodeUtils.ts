
// Helper function to format discount code for display
export const formatDiscountCode = (code: string) => {
  return code.toUpperCase();
};

// Helper function to validate a discount code
export const validateDiscountCode = (code: string) => {
  if (!code || code.length < 4) {
    return { isValid: false, message: 'Code must be at least 4 characters' };
  }
  
  // Add any additional validation rules here
  return { isValid: true };
};

// Helper function to share a promotion code
export const sharePromotionCode = async (code: string, message: string) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Spiritless Promotion',
        text: `${message}: ${code}`,
        url: window.location.origin
      });
      return { success: true };
    } else {
      // Fallback for browsers that don't support sharing
      await navigator.clipboard.writeText(`${message}: ${code}`);
      return { success: true, copied: true };
    }
  } catch (error) {
    console.error('Error sharing code:', error);
    return { success: false, error };
  }
};

// Helper function to check if a discount is active
export const isDiscountActive = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return now >= start && now <= end;
};

// Helper function to format discount value for display
export const formatDiscountValue = (type: string, value: number) => {
  if (type === 'percentage') {
    return `${value}%`;
  }
  if (type === 'fixed') {
    return `$${value.toFixed(2)}`;
  }
  if (type === 'free_item') {
    return 'Free Item';
  }
  return `${value}`;
};
