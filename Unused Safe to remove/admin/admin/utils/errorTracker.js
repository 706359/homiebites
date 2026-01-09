// Simple error tracker utility
const errorTracker = {
  log: (error, context = {}) => {
    console.error("[ErrorTracker]", context, error);
    // In production, you might want to send this to an error tracking service
  },
  track: (error, context = {}) => {
    console.error("[ErrorTracker]", context, error);
  },
  addToQueue: (operation, title, context = {}) => {
    const opId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("[ErrorTracker] Operation queued:", opId, operation, title, context);
    return opId;
  },
  captureError: (error, context = {}) => {
    console.error("[ErrorTracker] Error captured:", context, error);
    // In production, send to error tracking service
  },
  completeOperation: (opId, result = {}) => {
    console.log("[ErrorTracker] Operation completed:", opId, result);
  },
  failOperation: (opId, error) => {
    console.error("[ErrorTracker] Operation failed:", opId, error);
  },
};

export default errorTracker;

