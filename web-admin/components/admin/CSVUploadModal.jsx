import { useRef, useState } from 'react';
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
  const [uploadStatus, setUploadStatus] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [uploadOptions, setUploadOptions] = useState({
    skipDuplicates: false,
    autoGenerateOrderIds: false,
    updateExisting: true,
  });
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const xhrRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExtensions = ['.csv', '.xlsx', '.xls'];

    if (
      !validTypes.includes(selectedFile.type) &&
      !validExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      )
    ) {
      if (showNotification) {
        showNotification(
          'Invalid file type. Please upload CSV or Excel file.',
          'error'
        );
      }
      return;
    }

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

    if (
      selectedFile.type === 'text/csv' ||
      selectedFile.name.toLowerCase().endsWith('.csv')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;

          const allLines = text.split(/\r?\n/);

          const lines = allLines.filter((line) => line.trim().length > 0);

          if (lines.length > 0) {
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

            const headers = parseCSVLine(lines[0]).map((h) =>
              h.replace(/^"|"$/g, '').trim()
            );

            const previewRows = lines.slice(1, 2).map((line) => {
              const values = parseCSVLine(line).map((v) =>
                v.replace(/^"|"$/g, '').trim()
              );
              return headers.reduce((obj, header, idx) => {
                obj[header] = values[idx] || '';
                return obj;
              }, {});
            });

            const dataRows = lines.slice(1).filter((line) => {
              const parsed = parseCSVLine(line);

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
            showNotification(
              'Error parsing CSV file. Please check the file format.',
              'error'
            );
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
      setPreviewData({
        headers: [],
        rows: [],
        totalRows: 0,
        isExcel: true,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });

      if (showNotification) {
        showNotification(
          'Excel file selected. File will be validated during upload.',
          'info'
        );
      }
    }
  };

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

    const missingColumns = requiredColumns.filter(
      (col) =>
        !headers.some((h) =>
          h.toLowerCase().includes(col.toLowerCase().split(' ')[0])
        )
    );
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

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

  const isValidDate = (dateString) => {
    if (!dateString) return false;

    const formats = [
      /^\d{1,2}-\d{1,2}-\d{2,4}$/,
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
      /^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/,
    ];
    return (
      formats.some((format) => format.test(dateString)) ||
      !isNaN(new Date(dateString).getTime())
    );
  };

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

  const handleUpload = async () => {
    if (!file) {
      if (showNotification) {
        showNotification('Please select a file to upload', 'warning');
      }
      return;
    }

    if (validationErrors.length > 0) {
      if (showNotification) {
        showNotification(
          'Please fix validation errors before uploading',
          'error'
        );
      }
      return;
    }

    const performUpload = async () => {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadedRecords(0);
      setIsProgressMinimized(false);

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

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const fileProgress = (e.loaded / e.total) * 90;
            const progress = Math.min(90, Math.max(1, fileProgress));
            setUploadProgress(progress);

            if (totalRows > 0) {
              const estimatedRecords = Math.floor(
                (fileProgress / 90) * totalRows
              );
              setUploadedRecords(Math.min(totalRows, estimatedRecords));
            }
          } else {
            setUploadProgress(5);
          }
        });

        xhr.addEventListener('load', () => {
          try {
            let response;
            try {
              response = JSON.parse(xhr.responseText);
            } catch (parseError) {
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
              const importedCount =
                response.data?.imported || response.imported || 0;
              const updatedCount = response.data?.updated || 0;
              const skippedCount = response.data?.skipped || 0;
              const totalCount =
                response.data?.total ||
                response.data?.imported + updatedCount ||
                importedCount;

              if (previewData?.isExcel && totalCount > 0) {
                setTotalRecords(totalCount);
              }

              setUploadedRecords(importedCount + updatedCount);
              setUploadProgress(100);

              if (response.success !== false) {
                setUploadStatus('success');
                setIsProgressMinimized(false);
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
              showNotification(
                error.message || 'Error processing upload response',
                'error'
              );
            }
          } finally {
            setIsUploading(false);
            xhrRef.current = null;
          }
        });

        xhr.addEventListener('error', () => {
          setUploadStatus('error');
          setUploadProgress(0);
          setUploadedRecords(0);
          setIsProgressMinimized(false);
          setIsUploading(false);
          xhrRef.current = null;
          if (showNotification) {
            showNotification('Error uploading file', 'error');
          }
        });

        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('homiebites_token')
            : null;

        const apiUrl = api.baseURL || '';
        xhr.open('POST', `${apiUrl}/api/orders/upload-excel`);

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
        message: `Are you sure you want to upload ${
          recordCount > 0 ? `${recordCount} orders from ` : ''
        }this file? ${
          uploadOptions.updateExisting
            ? 'Existing orders will be updated.'
            : 'New orders will be added.'
        }`,
        type: 'info',
        confirmText: 'Upload',
        onConfirm: performUpload,
      });
    } else {
      await performUpload();
    }
  };

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

  const handleClose = () => {
    if (isUploading && xhrRef.current) {
      handleCancelUpload();
    }

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
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-container large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Upload Orders (CSV/Excel)</h2>
          <button
            className="btn btn-ghost btn-icon modal-close"
            onClick={handleClose}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          {!file && (
            <div
              className="dashboard-card file-upload file-upload-container"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="file-upload-label">
                <i className="fa-solid fa-cloud-upload-alt file-upload-icon file-upload-icon-style"></i>
                <h3 className="file-upload-text file-upload-title">
                  Drag & Drop CSV/Excel file
                </h3>
                <p className="file-upload-or">or</p>
                <button className="btn btn-primary">
                  <i className="fa-solid fa-folder-open"></i> Browse Files
                </button>
                <p className="file-upload-hint file-upload-hint-style">
                  Supported formats: .csv, .xlsx, .xls
                  <br />
                  Max file size: 10 MB
                </p>
              </div>
            </div>
          )}

          {file && !isUploading && uploadStatus !== 'success' && (
            <>
              <div className="dashboard-card margin-bottom-24">
                <div className="csv-file-info">
                  <div>
                    <h3 className="csv-file-name">
                      <i className="fa-solid fa-file"></i> {file.name}
                    </h3>
                    <p className="csv-file-size">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-small"
                    onClick={() => {
                      setFile(null);
                      setPreviewData(null);
                      setValidationErrors([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <i className="fa-solid fa-times"></i> Remove
                  </button>
                </div>

                {previewData && (
                  <div>
                    <h4 className="csv-preview-title">
                      Preview (First row with headers):
                    </h4>
                    <div className="orders-table-container csv-preview-container">
                      <table className="orders-table">
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
                    <p className="csv-preview-note">
                      {previewData.isExcel
                        ? 'Excel file detected. Row count will be determined during upload.'
                        : `Total rows detected: ${previewData.totalRows || 0}`}
                    </p>
                  </div>
                )}

                {validationErrors.length > 0 && (
                  <div className="alert alert-danger">
                    <div className="alert-icon">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Validation Errors:</div>
                      <ul className="csv-error-list">
                        {validationErrors.map((error, idx) => (
                          <li key={idx} className="csv-error-item">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {validationErrors.length === 0 && previewData && (
                  <div className="alert alert-success">
                    <div className="alert-icon">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">
                        File Validated Successfully
                      </div>
                      <div className="alert-message">
                        <ul className="csv-success-list">
                          <li>All required columns present</li>
                          <li>Date format correct</li>
                          <li>
                            Total Amount will be calculated automatically
                            (Quantity × Unit Price)
                          </li>
                          <li>No duplicate Order IDs detected</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="csv-upload-options">
                  <h4 className="csv-upload-options-title">Upload Options:</h4>
                  <div className="csv-upload-options-list">
                    <label className="csv-upload-option-label">
                      <input
                        type="checkbox"
                        checked={uploadOptions.updateExisting}
                        onChange={(e) =>
                          setUploadOptions({
                            ...uploadOptions,
                            updateExisting: e.target.checked,
                          })
                        }
                      />
                      <span>
                        <strong>Replace existing records</strong> (if Order ID
                        matches)
                        <br />
                        <span className="csv-upload-option-hint">
                          When checked, orders with matching Order IDs will be
                          updated instead of creating duplicates
                        </span>
                      </span>
                    </label>
                    <label className="csv-upload-option-label">
                      <input
                        type="checkbox"
                        checked={uploadOptions.skipDuplicates}
                        onChange={(e) =>
                          setUploadOptions({
                            ...uploadOptions,
                            skipDuplicates: e.target.checked,
                          })
                        }
                      />
                      <span>
                        Skip duplicate addresses (same day)
                        <br />
                        <span className="csv-upload-option-hint">
                          Only applies when Order ID is not present
                        </span>
                      </span>
                    </label>
                    <label className="csv-upload-option-label">
                      <input
                        type="checkbox"
                        checked={false}
                        disabled={true}
                        readOnly
                      />
                      <span className="csv-upload-option-disabled">
                        Auto-generate Order IDs (disabled - Order IDs must be
                        provided in your data)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {isUploading && !isProgressMinimized && (
            <div className="dashboard-card csv-upload-progress-container">
              <button
                onClick={() => setIsProgressMinimized(true)}
                title="Minimize and continue in background"
                className="csv-upload-minimize-btn tooltip-wrapper"
              >
                <i className="fa-solid fa-window-minimize"></i>
                <span className="tooltip">
                  Minimize and continue in background
                </span>
              </button>
              <h3 className="csv-upload-progress-title">Uploading Orders</h3>
              <div className="csv-upload-progress-info">
                <div className="csv-upload-progress-header">
                  <span className="csv-upload-progress-label">
                    {totalRecords > 0
                      ? `Processing ${uploadedRecords} of ${totalRecords} records`
                      : 'Uploading file'}
                  </span>
                  <span className="csv-upload-progress-count">
                    {uploadedRecords > 0 && totalRecords > 0
                      ? `${uploadedRecords} / ${totalRecords}`
                      : `${Math.round(uploadProgress)}%`}
                  </span>
                </div>
                <div className="progress progress-bar-container csv-upload-progress-bar-container">
                  <div className="progress-bar progress-fill csv-upload-progress-bar-fill" />
                </div>
              </div>
              <div className="csv-upload-progress-actions">
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => setIsProgressMinimized(true)}
                >
                  <i className="fa-solid fa-arrow-down"></i> Continue in
                  Background
                </button>
                <button
                  className="btn btn-special danger btn-small"
                  onClick={handleCancelUpload}
                >
                  <i className="fa-solid fa-times"></i> Cancel Upload
                </button>
              </div>
            </div>
          )}

          {isUploading && isProgressMinimized && (
            <div
              className="dashboard-card csv-upload-progress-card"
              onClick={() => setIsProgressMinimized(false)}
            >
              <div className="csv-upload-progress-card-content">
                <div className="avatar csv-upload-progress-avatar">
                  <i className="fa-solid fa-cloud-upload-alt"></i>
                </div>
                <div className="csv-upload-progress-details">
                  <div className="progress-label">
                    <span className="csv-upload-progress-label-text">
                      Uploading in background...
                    </span>
                    <span className="progress-percentage csv-upload-progress-percentage">
                      {uploadedRecords > 0 && totalRecords > 0
                        ? `${uploadedRecords} / ${totalRecords}`
                        : `${Math.round(uploadProgress)}%`}
                    </span>
                  </div>
                  <div className="progress progress-bar-container">
                    <div className="progress-bar progress-fill" />
                  </div>
                </div>
              </div>
              <div className="csv-upload-progress-actions-mini">
                <button
                  className="btn btn-special danger btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelUpload();
                  }}
                  title="Cancel Upload"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProgressMinimized(false);
                  }}
                  className="csv-upload-maximize-btn"
                  title="Show full progress"
                >
                  <i className="fa-solid fa-window-maximize"></i>
                </button>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="dashboard-card csv-upload-success">
              <i className="fa-solid fa-check-circle csv-upload-success-icon"></i>
              <h3 className="csv-upload-success-title">Upload Complete!</h3>
              <p className="margin-bottom-24 csv-text-primary">
                Your orders have been successfully imported.
              </p>
            </div>
          )}

          {!file && (
            <div className="dashboard-card csv-format-requirements">
              <h4 className="csv-format-requirements-title">
                <i className="fa-solid fa-info-circle"></i> CSV Format
                Requirements:
              </h4>
              <ul className="csv-format-requirements-list">
                <li>
                  <strong>Required Columns:</strong> Date, Delivery Address,
                  Quantity, Unit Price, Mode, Status, Payment Mode
                </li>
                <li>
                  <strong>Optional Columns:</strong> Order ID, Billing Month,
                  Year, Customer Name, Phone
                </li>
                <li>
                  <strong>Date format (RECOMMENDED):</strong> YYYY-MM-DD (e.g.,
                  2025-01-15) or format Excel cells as Date type. Also supports:
                  DD-MMM-YYYY, DD/MM/YYYY, DD-MM-YYYY (e.g., 15-Jan-2025,
                  15/01/2025)
                </li>
                <li>
                  <strong>Total Amount:</strong> Will be automatically
                  calculated as Quantity × Unit Price (you can omit this column)
                </li>
                <li>
                  <strong>Mode:</strong> Lunch, Dinner, Morning, Breakfast, etc.
                </li>
                <li>
                  <strong>Status:</strong> Paid, Pending, Unpaid, Delivered
                </li>
                <li>
                  <strong>Payment Mode:</strong> Online, Cash, UPI, Bank
                  Transfer
                </li>
                <li>No empty rows</li>
                <li>First row should contain column headers</li>
              </ul>
              <button
                className="btn btn-secondary btn-small csv-margin-top-16"
                onClick={handleDownloadTemplate}
              >
                <i className="fa-solid fa-download"></i> Download Sample CSV
                Template
              </button>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="csv-file-input-hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={isUploading && !isProgressMinimized}
            title={
              isUploading && !isProgressMinimized
                ? 'Upload in progress. Minimize to close.'
                : ''
            }
          >
            {uploadStatus === 'success'
              ? 'Close'
              : isUploading
                ? 'Minimize'
                : 'Cancel'}
          </button>
          {file && !isUploading && uploadStatus !== 'success' && (
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={validationErrors.length > 0}
            >
              <i className="fa-solid fa-upload"></i> Upload{' '}
              {previewData?.isExcel
                ? 'Orders'
                : previewData?.totalRows !== null &&
                    previewData?.totalRows !== undefined
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
