/**
 * useExcelOrders Hook
 * Manages Excel file upload and sync state
 * Explicit state machine instead of ref-based logic
 */
import { useState, useCallback } from "react";
import * as ordersService from "./orders.service.js";

/**
 * Sync state machine
 * @type {('idle' | 'uploading' | 'processing' | 'syncing' | 'success' | 'error' | 'cancelled')}
 */

/**
 * Hook for managing Excel order uploads
 * @param {Object} options
 * @param {Function} options.onSuccess - Callback when upload succeeds
 * @param {Function} options.onError - Callback when upload fails
 * @returns {Object} Excel upload state and operations
 */
export const useExcelOrders = (options = {}) => {
  const { onSuccess, onError } = options;

  const [syncState, setSyncState] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [subMessage, setSubMessage] = useState("");
  const [error, setError] = useState(null);
  const [cancellationToken, setCancellationToken] = useState(null);

  /**
   * Upload Excel file
   * @param {File} file - Excel file to upload
   * @param {Object} callbacks - Progress callbacks
   */
  const uploadExcel = useCallback(
    async (file, callbacks = {}) => {
      const { onProgress, onCancel } = callbacks;

      // Reset state
      setSyncState("uploading");
      setProgress(0);
      setMessage("Uploading Excel file...");
      setSubMessage("");
      setError(null);

      // Create cancellation token
      const cancelToken = { cancelled: false };
      setCancellationToken(cancelToken);

      try {
        // Create FormData
        const formData = new FormData();
        formData.append("file", file);

        setProgress(10);
        setMessage("Processing Excel file...");
        setSubMessage("Validating file format...");

        if (cancelToken.cancelled) {
          setSyncState("cancelled");
          setMessage("Upload cancelled");
          return { success: false, cancelled: true };
        }

        setProgress(30);
        setSubMessage("Sending to backend...");

        // Upload to backend
        const result = await ordersService.bulkUploadOrders(formData);

        if (cancelToken.cancelled) {
          setSyncState("cancelled");
          setMessage("Upload cancelled");
          return { success: false, cancelled: true };
        }

        if (result.success) {
          setProgress(100);
          setSyncState("success");
          setMessage(`Successfully imported ${result.data.imported} orders`);

          if (result.data.errors > 0) {
            setSubMessage(`${result.data.errors} orders had errors`);
          }

          if (onSuccess) {
            onSuccess(result.data);
          }

          return {
            success: true,
            data: result.data,
          };
        } else {
          setSyncState("error");
          setError(result.error);
          setMessage("Upload failed");
          setSubMessage(result.error);

          if (onError) {
            onError(result.error);
          }

          return {
            success: false,
            error: result.error,
          };
        }
      } catch (err) {
        if (cancelToken.cancelled) {
          setSyncState("cancelled");
          setMessage("Upload cancelled");
          return { success: false, cancelled: true };
        }

        const errorMsg = err.message || "Upload failed";
        setSyncState("error");
        setError(errorMsg);
        setMessage("Upload failed");
        setSubMessage(errorMsg);

        if (onError) {
          onError(errorMsg);
        }

        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        // Reset cancellation token after a delay
        setTimeout(() => {
          setCancellationToken(null);
          if (syncState === "success" || syncState === "error") {
            // Auto-reset to idle after showing result
            setTimeout(() => {
              setSyncState("idle");
              setProgress(0);
              setMessage("");
              setSubMessage("");
            }, 2000);
          }
        }, 100);
      }
    },
    [onSuccess, onError, syncState],
  );

  /**
   * Cancel current upload
   */
  const cancel = useCallback(() => {
    if (cancellationToken) {
      cancellationToken.cancelled = true;
      setSyncState("cancelled");
      setMessage("Cancelling...");
    }
  }, [cancellationToken]);

  /**
   * Reset state to idle
   */
  const reset = useCallback(() => {
    setSyncState("idle");
    setProgress(0);
    setMessage("");
    setSubMessage("");
    setError(null);
    setCancellationToken(null);
  }, []);

  return {
    // State
    syncState,
    progress,
    message,
    subMessage,
    error,
    isIdle: syncState === "idle",
    isUploading:
      syncState === "uploading" ||
      syncState === "processing" ||
      syncState === "syncing",
    isSuccess: syncState === "success",
    isError: syncState === "error",
    isCancelled: syncState === "cancelled",
    // Operations
    uploadExcel,
    cancel,
    reset,
  };
};
