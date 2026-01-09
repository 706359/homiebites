import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../../lib/api-admin.js';

const CSVUploadModal = ({
  show,
  onClose,
  onUploadSuccess,
  showNotification,
  loadOrders,
  showConfirmation,
}) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedRecords, setUploadedRecords] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProgressMinimized, setIsProgressMinimized] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [uploadOptions, setUploadOptions] = useState({
    skipDuplicates: false, // Changed: Allow duplicates to be replaced
    autoGenerateOrderIds: false,
    updateExisting: true, // Changed: Default to true - replace existing records by Order ID
  });
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const xhrRef = useRef(null); // Store XHR for cancellation

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExtensions = ['.csv', '.xlsx', '.xls'];

    if (
      !validTypes.includes(selectedFile.type) &&
      !validExtensions.some((ext) => selectedFile.name.toLowerCase().endsWith(ext))
    ) {
      if (showNotification) {
        showNotification('Invalid file type. Please upload CSV or Excel file.', 'error');
      }
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      if (showNotification) {
        showNotification('File size exceeds 10MB limit.', 'error');
      }
      return;
    }

    setFile(selectedFile);
    setUploadStatus(null);
    setValidationErrors([]);
    setPreviewData(null);

    // Read and preview file
    if (selectedFile.type === 'text/csv' || selectedFile.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          // Split by newlines (handle both \n and \r\n)
          const allLines = text.split(/\r?\n/);

          // Filter out completely empty lines
          const lines = allLines.filter((line) => line.trim().length > 0);

          if (lines.length > 0) {
            // Parse CSV with proper handling of quoted values
            const parseCSVLine = (line) => {
              const result = [];
              let current = '';
              let inQuotes = false;

              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              result.push(current.trim());
              return result;
            };

            const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').trim());

            // Parse preview rows (first data row only)
            const previewRows = lines.slice(1, 2).map((line) => {
              const values = parseCSVLine(line).map((v) => v.replace(/^"|"$/g, '').trim());
              return headers.reduce((obj, header, idx) => {
                obj[header] = values[idx] || '';
                return obj;
              }, {});
            });

            // Calculate total rows correctly (excluding header)
            // Count only non-empty data rows
            const dataRows = lines.slice(1).filter((line) => {
              const parsed = parseCSVLine(line);
              // Check if row has at least one non-empty value
              return parsed.some((val) => val.trim().length > 0);
            });
            const totalRows = dataRows.length;

            setPreviewData({ headers, rows: previewRows, totalRows });
            validateCSVData(headers, previewRows);
          } else {
            setPreviewData({ headers: [], rows: [], totalRows: 0 });
          }
        } catch (error) {
          console.error('Error parsing CSV:', error);
          if (showNotification) {
            showNotification('Error parsing CSV file. Please check the file format.', 'error');
          }
          setPreviewData({ headers: [], rows: [], totalRows: 0 });
        }
      };
      reader.onerror = () => {
        if (showNotification) {
          showNotification('Error reading CSV file', 'error');
        }
        setPreviewData({ headers: [], rows: [], totalRows: 0 });
      };
      reader.readAsText(selectedFile);
    } else {
      // For Excel files, parse client-side using xlsx library
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });

          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // Array of arrays
            defval: '', // Default value for empty cells
            raw: false, // Convert dates to strings
          });

          if (jsonData.length > 0) {
            // First row is headers
            const headers = jsonData[0].map((h) => String(h || '').trim());

            // Get first data row only (skip header row)
            const previewRows = jsonData.slice(1, 2).map((row) => {
              const rowObj = {};
              headers.forEach((header, idx) => {
                let cellValue = row[idx];
                // Handle date objects
                if (cellValue instanceof Date) {
                  // Format date as YYYY-MM-DD for display
                  const year = cellValue.getFullYear();
                  const month = String(cellValue.getMonth() + 1).padStart(2, '0');
                  const day = String(cellValue.getDate()).padStart(2, '0');
                  cellValue = `${year}-${month}-${day}`;
                } else {
                  cellValue = String(cellValue || '').trim();
                }
                rowObj[header] = cellValue;
              });
              return rowObj;
            });

            // Count total data rows (excluding header and empty rows)
            const dataRows = jsonData.slice(1).filter((row) => {
              // Check if row has at least one non-empty value
              return row.some((cell) => String(cell || '').trim().length > 0);
            });
            const totalRows = dataRows.length;

            setPreviewData({ headers, rows: previewRows, totalRows, isExcel: true });
            validateCSVData(headers, previewRows);
          } else {
            setPreviewData({ headers: [], rows: [], totalRows: 0, isExcel: true });
          }
        } catch (error) {
          console.error('Error parsing Excel:', error);
          if (showNotification) {
            showNotification('Error parsing Excel file. Please check the file format.', 'error');
          }
          setPreviewData({ headers: [], rows: [], totalRows: 0, isExcel: true });
        }
      };
      reader.onerror = () => {
        if (showNotification) {
          showNotification('Error reading Excel file', 'error');
        }
        setPreviewData({ headers: [], rows: [], totalRows: 0, isExcel: true });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // Validate CSV data
  const validateCSVData = (headers, rows) => {
    const errors = [];
    const requiredColumns = [
      'Date',
      'Delivery Address',
      'Quantity',
      'Unit Price',
      'Mode',
      'Status',
      'Payment Mode',
    ];

    // Check required columns
    const missingColumns = requiredColumns.filter(
      (col) => !headers.some((h) => h.toLowerCase().includes(col.toLowerCase().split(' ')[0]))
    );
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate date format
    const dateColumn = headers.find((h) => h.toLowerCase().includes('date'));
    if (dateColumn) {
      rows.forEach((row, idx) => {
        const dateValue = row[dateColumn];
        if (dateValue && !isValidDate(dateValue)) {
          errors.push(`Row ${idx + 2}: Invalid date format "${dateValue}"`);
        }
      });
    }

    setValidationErrors(errors);
  };

  // Check if date is valid
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    // Try multiple date formats
    const formats = [
      /^\d{1,2}-\d{1,2}-\d{2,4}$/, // DD-MM-YY or DD-MM-YYYY
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, // DD/MM/YY or DD/MM/YYYY
      /^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/, // DD-MMM-YY or DD-MMM-YYYY
    ];
    return (
      formats.some((format) => format.test(dateString)) || !isNaN(new Date(dateString).getTime())
    );
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    e.currentTarget.classList.remove('drag-over');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      if (showNotification) {
        showNotification('Please select a file to upload', 'warning');
      }
      return;
    }

    if (validationErrors.length > 0) {
      if (showNotification) {
        showNotification('Please fix validation errors before uploading', 'error');
      }
      return;
    }

    const performUpload = async () => {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadedRecords(0);
      setIsProgressMinimized(false);
      // For Excel files, totalRows might be null - will be updated from server response
      const totalRows =
        previewData?.totalRows !== null && previewData?.totalRows !== undefined
          ? previewData.totalRows
          : 0;
      setTotalRecords(totalRows);
      setUploadStatus(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('options', JSON.stringify(uploadOptions));

        // Use XMLHttpRequest for real progress tracking
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr; // Store for cancellation

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && totalRows > 0) {
            // File upload progress (0-90%)
            const fileProgress = (e.loaded / e.total) * 90;
            setUploadProgress(Math.min(90, fileProgress));

            // Estimate records uploaded based on file upload progress
            const estimatedRecords = Math.floor((fileProgress / 90) * totalRows);
            setUploadedRecords(Math.min(totalRows, estimatedRecords));
          }
        });

        // Handle response
        xhr.addEventListener('load', () => {
          try {
            let response;
            try {
              response = JSON.parse(xhr.responseText);
            } catch (parseError) {
              // If response is not JSON, it might be HTML error page
              setUploadStatus('error');
              setIsUploading(false);
              xhrRef.current = null;
              if (showNotification) {
                const errorMsg =
                  xhr.status === 401 || xhr.status === 403
                    ? 'Authentication failed. Please login again.'
                    : xhr.status === 413
                      ? 'File too large. Maximum size is 10MB.'
                      : `Upload failed: Server returned status ${xhr.status}`;
                showNotification(errorMsg, 'error');
              }
              return;
            }

            if (xhr.status === 200 || xhr.status === 201) {
              const importedCount = response.data?.imported || response.imported || 0;
              const updatedCount = response.data?.updated || 0;
              const skippedCount = response.data?.skipped || 0;
              const totalCount =
                response.data?.total || response.data?.imported + updatedCount || importedCount;

              // Update total records if it was unknown (Excel files)
              if (previewData?.isExcel && totalCount > 0) {
                setTotalRecords(totalCount);
              }

              setUploadedRecords(importedCount + updatedCount);
              setUploadProgress(100);

              if (response.success !== false) {
                setUploadStatus('success');
                setIsProgressMinimized(false); // Show success message
                if (showNotification) {
                  let message = '';
                  if (updatedCount > 0 && importedCount > 0) {
                    message = `Successfully processed: ${importedCount} new orders, ${updatedCount} updated`;
                  } else if (updatedCount > 0) {
                    message = `Successfully updated ${updatedCount} existing orders`;
                  } else {
                    message = `Successfully uploaded ${importedCount} orders`;
                  }
                  if (skippedCount > 0) {
                    message += ` (${skippedCount} skipped)`;
                  }
                  showNotification(message, 'success');
                }
                if (loadOrders) {
                  setTimeout(() => {
                    loadOrders();
                  }, 1000);
                }
                if (onUploadSuccess) {
                  setTimeout(() => {
                    onUploadSuccess(response.data || response);
                    handleClose();
                  }, 2000);
                }
              } else {
                setUploadStatus('error');
                if (showNotification) {
                  showNotification(response.error || 'Upload failed', 'error');
                }
              }
            } else {
              // Non-200 status code
              setUploadStatus('error');
              console.error('[CSVUpload] Upload failed:', {
                status: xhr.status,
                statusText: xhr.statusText,
                response: response,
                responseText: xhr.responseText,
              });
              if (showNotification) {
                const errorMsg =
                  response?.error ||
                  response?.message ||
                  xhr.responseText ||
                  `Upload failed: Server returned status ${xhr.status}`;
                showNotification(errorMsg, 'error');
              }
            }
          } catch (error) {
            setUploadStatus('error');
            console.error('Error processing upload response:', error);
            if (showNotification) {
              showNotification(error.message || 'Error processing upload response', 'error');
            }
          } finally {
            setIsUploading(false);
            xhrRef.current = null; // Clear reference
          }
        });

        xhr.addEventListener('error', () => {
          setUploadStatus('error');
          setUploadProgress(0);
          setUploadedRecords(0);
          setIsProgressMinimized(false); // Show error message
          setIsUploading(false);
          xhrRef.current = null; // Clear reference
          if (showNotification) {
            showNotification('Error uploading file', 'error');
          }
        });

        // Get token for authorization
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('homiebites_token') : null;

        // Start upload - use relative URL for Next.js API routes
        // api.baseURL is empty for Next.js API routes (they run on the same server)
        const apiUrl = api.baseURL || '';
        xhr.open('POST', `${apiUrl}/api/orders/upload-excel`);

        // Set authorization header if token exists
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      } catch (error) {
        setUploadStatus('error');
        setUploadProgress(0);
        setUploadedRecords(0);
        console.error('Upload error:', error);
        if (showNotification) {
          showNotification(error.message || 'Error uploading file', 'error');
        }
        setIsUploading(false);
      }
    };

    if (showConfirmation) {
      const recordCount = previewData?.totalRows || 0;
      showConfirmation({
        title: 'Upload CSV File',
        message: `Are you sure you want to upload ${recordCount > 0 ? `${recordCount} orders from ` : ''}this file? ${uploadOptions.updateExisting ? 'Existing orders will be updated.' : 'New orders will be added.'}`,
        type: 'info',
        confirmText: 'Upload',
        onConfirm: performUpload,
      });
    } else {
      await performUpload();
    }
  };

  // Handle cancel upload
  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedRecords(0);
    setTotalRecords(0);
    setUploadStatus(null);
    setIsProgressMinimized(false);
    if (showNotification) {
      showNotification('Upload cancelled', 'info');
    }
  };

  // Handle close
  const handleClose = () => {
    // Cancel upload if in progress
    if (isUploading && xhrRef.current) {
      handleCancelUpload();
    }

    // Don't close if upload is in progress - warn user (if not cancelled)
    if (isUploading) {
      if (showNotification) {
        showNotification(
          'Upload is in progress. Please wait for it to complete or cancel it.',
          'warning'
        );
      }
      return;
    }
    setFile(null);
    setUploadProgress(0);
    setUploadedRecords(0);
    setTotalRecords(0);
    setUploadStatus(null);
    setIsProgressMinimized(false);
    setPreviewData(null);
    setValidationErrors([]);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  // Download sample CSV template
  const handleDownloadTemplate = () => {
    const template = `Order ID,Date,Delivery Address,Quantity,Unit Price,Mode,Status,Payment Mode,Billing Month,Year,Customer Name,Phone
HB-Jan'25-15-000001,2025-01-15,A3-1206,2,100,Lunch,Paid,Online,1,2025,John Doe,9876543210
HB-Jan'25-15-000002,2025-01-20,A3-1206,3,100,Dinner,Pending,Cash,1,2025,Jane Smith,9876543211
HB-Jan'25-14-000001,2025-01-25,B2-405,2,100,Lunch,Paid,UPI,1,2025,Bob Johnson,9876543212`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders_template.csv';
    link.click();
  };

  if (!show) return null;

  return (
    <div className='modal-overlay' onClick={handleClose}>
      <div
        className='modal-container'
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px' }}
      >
        <div className='modal-header'>
          <h2>Upload Orders (CSV/Excel)</h2>
          <button className='modal-close' onClick={handleClose}>
            <i className='fa-solid fa-times'></i>
          </button>
        </div>
        <div className='modal-body'>
          {/* File Drop Zone */}
          {!file && (
            <div
              className='dashboard-card'
              style={{
                border: '2px dashed var(--admin-border)',
                padding: '48px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <i
                className='fa-solid fa-cloud-upload-alt'
                style={{ fontSize: '64px', color: 'var(--admin-accent)', marginBottom: '16px' }}
              ></i>
              <h3 style={{ marginBottom: '8px' }}>Drag & Drop CSV/Excel file</h3>
              <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '16px' }}>or</p>
              <button className='btn btn-primary'>
                <i className='fa-solid fa-folder-open'></i> Browse Files
              </button>
              <p
                style={{ color: 'var(--admin-text-light)', fontSize: '0.85rem', marginTop: '16px' }}
              >
                Supported formats: .csv, .xlsx, .xls
                <br />
                Max file size: 10 MB
              </p>
            </div>
          )}

          {/* File Selected */}
          {file && !isUploading && uploadStatus !== 'success' && (
            <>
              <div className='dashboard-card margin-bottom-24'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>
                      <i className='fa-solid fa-file'></i> {file.name}
                    </h3>
                    <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    className='btn btn-ghost btn-small'
                    onClick={() => {
                      setFile(null);
                      setPreviewData(null);
                      setValidationErrors([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <i className='fa-solid fa-times'></i> Remove
                  </button>
                </div>

                {/* Preview */}
                {previewData && (
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Preview (First row with headers):</h4>
                    <div
                      className='orders-table-container'
                      style={{ maxHeight: '300px', overflow: 'auto' }}
                    >
                      <table className='orders-table'>
                        <thead>
                          <tr>
                            {previewData.headers.map((header, idx) => (
                              <th key={idx}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {previewData.headers.map((header, colIdx) => (
                                <td key={colIdx}>{row[header] || ''}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p
                      style={{
                        color: 'var(--admin-text-secondary)',
                        fontSize: '0.85rem',
                        marginTop: '8px',
                      }}
                    >
                      {previewData.isExcel
                        ? 'Excel file detected. Row count will be determined during upload.'
                        : `Total rows detected: ${previewData.totalRows || 0}`}
                    </p>
                  </div>
                )}

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div
                    style={{
                      background: 'var(--admin-danger-light)',
                      border: '2px solid var(--admin-danger)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginTop: '16px',
                    }}
                  >
                    <h4 style={{ color: 'var(--admin-danger)', marginBottom: '8px' }}>
                      <i className='fa-solid fa-exclamation-triangle'></i> Validation Errors:
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {validationErrors.map((error, idx) => (
                        <li key={idx} style={{ color: 'var(--admin-text)', marginBottom: '4px' }}>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Validation Success */}
                {validationErrors.length === 0 && previewData && (
                  <div
                    style={{
                      background: 'var(--admin-success-light)',
                      border: '2px solid var(--admin-success)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginTop: '16px',
                    }}
                  >
                    <p style={{ color: 'var(--admin-success)', fontWeight: '600' }}>
                      <i className='fa-solid fa-check-circle'></i> Validation passed
                    </p>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '0.9rem' }}>
                      <li>All required columns present</li>
                      <li>Date format correct</li>
                      <li>Total Amount will be calculated automatically (Quantity × Unit Price)</li>
                      <li>No duplicate Order IDs detected</li>
                    </ul>
                  </div>
                )}

                {/* Upload Options */}
                <div
                  style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '2px solid var(--admin-border)',
                  }}
                >
                  <h4 style={{ marginBottom: '12px' }}>Upload Options:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={uploadOptions.updateExisting}
                        onChange={(e) =>
                          setUploadOptions({ ...uploadOptions, updateExisting: e.target.checked })
                        }
                      />
                      <span>
                        <strong>Replace existing records</strong> (if Order ID matches)
                        <br />
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--admin-text-secondary)',
                            marginLeft: '24px',
                          }}
                        >
                          When checked, orders with matching Order IDs will be updated instead of
                          creating duplicates
                        </span>
                      </span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={uploadOptions.skipDuplicates}
                        onChange={(e) =>
                          setUploadOptions({ ...uploadOptions, skipDuplicates: e.target.checked })
                        }
                      />
                      <span>
                        Skip duplicate addresses (same day)
                        <br />
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--admin-text-secondary)',
                            marginLeft: '24px',
                          }}
                        >
                          Only applies when Order ID is not present
                        </span>
                      </span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type='checkbox' checked={false} disabled={true} readOnly />
                      <span style={{ opacity: 0.6 }}>
                        Auto-generate Order IDs (disabled - Order IDs must be provided in your data)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Upload Progress */}
          {isUploading && !isProgressMinimized && (
            <div
              className='dashboard-card'
              style={{ textAlign: 'center', padding: '48px', position: 'relative' }}
            >
              <button
                onClick={() => setIsProgressMinimized(true)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--admin-text-secondary)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  fontSize: '18px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'var(--admin-accent-light, rgba(68, 144, 49, 0.1))';
                  e.currentTarget.style.color = 'var(--admin-accent, #449031)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--admin-text-secondary)';
                }}
                title='Minimize and continue in background'
              >
                <i className='fa-solid fa-window-minimize'></i>
              </button>
              <h3 className='margin-bottom-24'>Uploading Orders...</h3>
              <div className='margin-bottom-24'>
                <div
                  style={{
                    width: '100%',
                    height: '32px',
                    background: 'var(--admin-glass-border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'var(--admin-accent, #449031)',
                      borderRadius: '16px',
                      transition: 'width 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                    }}
                  >
                    {uploadProgress >= 10 && (
                      <span>
                        {uploadedRecords > 0 && totalRecords > 0
                          ? `${uploadedRecords} / ${totalRecords}`
                          : `${Math.round(uploadProgress)}%`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--admin-text-secondary)' }}>
                {totalRecords > 0
                  ? `Processing ${uploadedRecords} of ${totalRecords} records... Please wait.`
                  : 'Processing your file... Please wait.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => setIsProgressMinimized(true)}
                >
                  <i className='fa-solid fa-arrow-down'></i> Continue in Background
                </button>
                <button className='btn btn-special danger btn-small' onClick={handleCancelUpload}>
                  <i className='fa-solid fa-times'></i> Cancel Upload
                </button>
              </div>
            </div>
          )}

          {/* Minimized Progress Indicator */}
          {isUploading && isProgressMinimized && (
            <div
              className='dashboard-card'
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--admin-accent-light, rgba(68, 144, 49, 0.1))',
                border: '2px solid var(--admin-accent, #449031)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setIsProgressMinimized(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'var(--admin-accent-light, rgba(68, 144, 49, 0.15))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'var(--admin-accent-light, rgba(68, 144, 49, 0.1))';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--admin-accent, #449031)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  <i className='fa-solid fa-cloud-upload-alt'></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '14px' }}
                    >
                      Uploading in background...
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                      {uploadedRecords > 0 && totalRecords > 0
                        ? `${uploadedRecords} / ${totalRecords}`
                        : `${Math.round(uploadProgress)}%`}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'var(--admin-glass-border)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: 'var(--admin-accent, #449031)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className='btn btn-special danger btn-small'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelUpload();
                  }}
                  title='Cancel Upload'
                >
                  <i className='fa-solid fa-times'></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProgressMinimized(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--admin-text-secondary)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.color = 'var(--admin-accent, #449031)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--admin-text-secondary)';
                  }}
                  title='Show full progress'
                >
                  <i className='fa-solid fa-window-maximize'></i>
                </button>
              </div>
            </div>
          )}

          {/* Upload Success */}
          {uploadStatus === 'success' && (
            <div
              className='dashboard-card'
              style={{
                background: 'var(--admin-success-light)',
                border: '2px solid var(--admin-success)',
                textAlign: 'center',
                padding: '48px',
              }}
            >
              <i
                className='fa-solid fa-check-circle'
                style={{ fontSize: '64px', color: 'var(--admin-success)', marginBottom: '16px' }}
              ></i>
              <h3 style={{ color: 'var(--admin-success)', marginBottom: '16px' }}>
                Upload Complete!
              </h3>
              <p className='margin-bottom-24' style={{ color: 'var(--admin-text)' }}>
                Your orders have been successfully imported.
              </p>
            </div>
          )}

          {/* CSV Format Requirements */}
          {!file && (
            <div className='dashboard-card' style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: '12px' }}>
                <i className='fa-solid fa-info-circle'></i> CSV Format Requirements:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--admin-text-secondary)' }}>
                <li>
                  <strong>Required Columns:</strong> Date, Delivery Address, Quantity, Unit Price,
                  Mode, Status, Payment Mode
                </li>
                <li>
                  <strong>Optional Columns:</strong> Order ID, Billing Month, Year, Customer Name,
                  Phone
                </li>
                <li>
                  <strong>Date format (RECOMMENDED):</strong> YYYY-MM-DD (e.g., 2025-01-15) or
                  format Excel cells as Date type. Also supports: DD-MMM-YYYY, DD/MM/YYYY,
                  DD-MM-YYYY (e.g., 15-Jan-2025, 15/01/2025)
                </li>
                <li>
                  <strong>Total Amount:</strong> Will be automatically calculated as Quantity × Unit
                  Price (you can omit this column)
                </li>
                <li>
                  <strong>Mode:</strong> Lunch, Dinner, Morning, Breakfast, etc.
                </li>
                <li>
                  <strong>Status:</strong> Paid, Pending, Unpaid, Delivered
                </li>
                <li>
                  <strong>Payment Mode:</strong> Online, Cash, UPI, Bank Transfer
                </li>
                <li>No empty rows</li>
                <li>First row should contain column headers</li>
              </ul>
              <button
                className='btn btn-secondary btn-small'
                onClick={handleDownloadTemplate}
                style={{ marginTop: '16px' }}
              >
                <i className='fa-solid fa-download'></i> Download Sample CSV Template
              </button>
            </div>
          )}
        </div>
        <div className='modal-footer'>
          <input
            ref={fileInputRef}
            type='file'
            accept='.csv,.xlsx,.xls'
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <button
            className='btn btn-ghost'
            onClick={handleClose}
            disabled={isUploading && !isProgressMinimized}
            title={
              isUploading && !isProgressMinimized ? 'Upload in progress. Minimize to close.' : ''
            }
          >
            {uploadStatus === 'success' ? 'Close' : isUploading ? 'Minimize' : 'Cancel'}
          </button>
          {file && !isUploading && uploadStatus !== 'success' && (
            <button
              className='btn btn-primary'
              onClick={handleUpload}
              disabled={validationErrors.length > 0}
            >
              <i className='fa-solid fa-upload'></i> Upload{' '}
              {previewData?.isExcel
                ? 'Orders'
                : previewData?.totalRows !== null && previewData?.totalRows !== undefined
                  ? `${previewData.totalRows} Orders`
                  : '0 Orders'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUploadModal;
