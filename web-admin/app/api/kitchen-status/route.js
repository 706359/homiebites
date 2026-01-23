import connectDB from '../../../lib/db.js';
import Settings from '../../../lib/models/Settings.js';

// Helper function to check if kitchen is open
const isKitchenOpen = (settings) => {
  if (!settings) return true; // Default to open if no settings

  // Check if kitchenEnabled is explicitly set to false
  // If undefined or true, kitchen is open (unless dates override it)
  const isExplicitlyDisabled = settings.kitchenEnabled === false;
  
  // If explicitly disabled, check date range
  if (isExplicitlyDisabled) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If no dates set, closed for today only
    if (!settings.kitchenClosedFrom && !settings.kitchenClosedTo) {
      return false; // Closed today
    }

    // Check if today is within closed date range
    if (settings.kitchenClosedFrom && settings.kitchenClosedTo) {
      const fromDate = new Date(settings.kitchenClosedFrom);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(settings.kitchenClosedTo);
      toDate.setHours(23, 59, 59, 999);

      // If today is within the closed range, kitchen is closed
      if (today >= fromDate && today <= toDate) {
        return false;
      }
      // If today is past the closed range, kitchen is open again
      return true;
    }

    // If only from date is set (no to date)
    if (settings.kitchenClosedFrom && !settings.kitchenClosedTo) {
      const fromDate = new Date(settings.kitchenClosedFrom);
      fromDate.setHours(0, 0, 0, 0);
      // If today is before the from date, kitchen is still open
      if (today < fromDate) {
        return true;
      }
      // If today is on or after from date, kitchen is closed
      return false;
    }

    return false; // Closed
  }

  // If kitchenEnabled is true or undefined, kitchen is open
  return true;
};

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();

    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Kitchen Status API] Settings:', {
        kitchenEnabled: settings.kitchenEnabled,
        kitchenClosedFrom: settings.kitchenClosedFrom,
        kitchenClosedTo: settings.kitchenClosedTo,
      });
    }

    const kitchenOpen = isKitchenOpen(settings);
    
    // Format date range message if closed
    let message = '';
    let closedFrom = null;
    let closedTo = null;

    if (!kitchenOpen) {
      if (settings.kitchenClosedFrom && settings.kitchenClosedTo) {
        closedFrom = new Date(settings.kitchenClosedFrom);
        closedTo = new Date(settings.kitchenClosedTo);
        const fromFormatted = closedFrom.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const toFormatted = closedTo.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        message = `Kitchen is closed from ${fromFormatted} to ${toFormatted}`;
      } else {
        const today = new Date();
        const todayFormatted = today.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        message = `Kitchen is closed today (${todayFormatted}). It will reopen tomorrow.`;
      }
    }

    const responseData = {
      isOpen: kitchenOpen,
      message: message,
      closedFrom: closedFrom ? closedFrom.toISOString().split('T')[0] : null,
      closedTo: closedTo ? closedTo.toISOString().split('T')[0] : null,
    };

    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Kitchen Status API] Response:', responseData);
    }

    return Response.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching kitchen status:', error);
    // Default to open on error
    return Response.json({
      success: true,
      data: {
        isOpen: true,
        message: '',
        closedFrom: null,
        closedTo: null,
      },
    });
  }
}
