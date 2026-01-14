import { useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDate, formatDateMonthDay, parseOrderDate } from './utils/dateUtils.js';
import ExcelJS from 'exceljs';

const ReportsTab = ({ orders = [], loading = false, showNotification }) => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [groupByArea, setGroupByArea] = useState(false);
  const [groupByMode, setGroupByMode] = useState(false);
  const [reportFormat, setReportFormat] = useState('csv'); 
  const [showGenerator, setShowGenerator] = useState(false);

  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'Daily Sales',
      schedule: 'Daily 9AM',
      format: 'Email',
    },
    {
      id: 2,
      name: 'Weekly Summary',
      schedule: 'Mon 10AM',
      format: 'PDF',
    },
    {
      id: 3,
      name: 'Monthly',
      schedule: '1st 8AM',
      format: 'Excel',
    },
  ]);

  const [reportHistory, setReportHistory] = useState([
    {
      id: 1,
      date: '15-Jan-2025',
      type: 'Sales Report',
      period: "Dec'24",
    },
    {
      id: 2,
      date: '01-Jan-2025',
      type: 'Monthly Statement',
      period: "Dec'24",
    },
  ]);

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const getOrderAmount = (order) => {
    let amount = null;
    
    if (order.totalAmount !== undefined && order.totalAmount !== null) {
      amount = parseFloat(order.totalAmount);
    } else if (order.total !== undefined && order.total !== null) {
      amount = parseFloat(order.total);
    }
    
    if (amount === null || isNaN(amount)) {
      const qty = parseFloat(order.quantity || 1);
      const price = parseFloat(order.unitPrice || 0);
      amount = qty * price;
    }
    
    return isNaN(amount) ? 0 : amount;
  };

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      if (showNotification) showNotification('Please select a report type', 'warning');
      return;
    }

    let filteredOrders = [...orders];
    if (reportDateFrom) {
      const from = parseOrderDate(reportDateFrom);
      if (from) {
        from.setHours(0, 0, 0, 0);
        filteredOrders = filteredOrders.filter((o) => {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          return orderDate && orderDate >= from;
        });
      }
    }
    if (reportDateTo) {
      const to = parseOrderDate(reportDateTo);
      if (to) {
        to.setHours(23, 59, 59, 999);
        filteredOrders = filteredOrders.filter((o) => {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          return orderDate && orderDate <= to;
        });
      }
    }

    let csvContent = '';
    const reportDate = new Date().toISOString().split('T')[0];

    if (selectedReportType === 'Sales Report') {
      
      csvContent =
        'Order ID,Date,Delivery Address,Quantity,Unit Price (₹),Total Amount (₹),Mode,Status,Payment Mode\n';
      filteredOrders
        .sort((a, b) => {
          const dateA = parseOrderDate(a.date || a.order_date || null);
          const dateB = parseOrderDate(b.date || b.order_date || null);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateB - dateA;
        })
        .forEach((o) => {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          const dateStr = orderDate ? formatDate(orderDate) : 'N/A';
          const orderId = o.orderId || o._id || 'N/A';
          const address = o.deliveryAddress || o.customerAddress || o.address || 'N/A';
          const quantity = o.quantity || 1;
          const unitPrice = parseFloat(o.unitPrice || 0).toFixed(2);
          const totalAmount = getOrderAmount(o).toFixed(2);
          const mode = o.mode || 'N/A';
          const status = o.status || 'N/A';
          const paymentMode = o.paymentMode || 'N/A';

          csvContent += `${escapeCSV(orderId)},${escapeCSV(dateStr)},${escapeCSV(address)},${escapeCSV(quantity)},${escapeCSV(unitPrice)},${escapeCSV(totalAmount)},${escapeCSV(mode)},${escapeCSV(status)},${escapeCSV(paymentMode)}\n`;
        });

      const totalRevenue = filteredOrders.reduce((sum, o) => sum + getOrderAmount(o), 0);
      const totalOrders = filteredOrders.length;
      const paidOrders = filteredOrders.filter(
        (o) => (o.status || '').toLowerCase() === 'paid'
      ).length;
      const unpaidOrders = filteredOrders.filter((o) => {
        const status = (o.status || '').toLowerCase();
        return status === 'unpaid' || status === 'pending';
      }).length;

      csvContent += `\nSummary\n`;
      csvContent += `Total Orders,${totalOrders}\n`;
      csvContent += `Total Revenue (₹),${totalRevenue.toFixed(2)}\n`;
      csvContent += `Paid Orders,${paidOrders}\n`;
      csvContent += `Unpaid Orders,${unpaidOrders}\n`;
    } else if (selectedReportType === 'Payment Report') {
      
      csvContent =
        'Payment Mode,Total Orders,Total Amount (₹),Paid Orders,Paid Amount (₹),Unpaid Orders,Unpaid Amount (₹),Pending Orders,Pending Amount (₹)\n';

      const paymentStats = {};
      filteredOrders.forEach((o) => {
        const paymentMode = o.paymentMode || 'Not Set';
        if (!paymentStats[paymentMode]) {
          paymentStats[paymentMode] = {
            paymentMode,
            totalOrders: 0,
            totalAmount: 0,
            paidOrders: 0,
            paidAmount: 0,
            unpaidOrders: 0,
            unpaidAmount: 0,
            pendingOrders: 0,
            pendingAmount: 0,
          };
        }

        const amount = getOrderAmount(o);
        const status = (o.status || '').toLowerCase();

        paymentStats[paymentMode].totalOrders++;
        paymentStats[paymentMode].totalAmount += amount;

        if (status === 'paid') {
          paymentStats[paymentMode].paidOrders++;
          paymentStats[paymentMode].paidAmount += amount;
        } else if (status === 'unpaid') {
          paymentStats[paymentMode].unpaidOrders++;
          paymentStats[paymentMode].unpaidAmount += amount;
        } else {
          paymentStats[paymentMode].pendingOrders++;
          paymentStats[paymentMode].pendingAmount += amount;
        }
      });

      Object.values(paymentStats)
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .forEach((stat) => {
          csvContent += `${escapeCSV(stat.paymentMode)},${escapeCSV(stat.totalOrders)},${escapeCSV(stat.totalAmount.toFixed(2))},${escapeCSV(stat.paidOrders)},${escapeCSV(stat.paidAmount.toFixed(2))},${escapeCSV(stat.unpaidOrders)},${escapeCSV(stat.unpaidAmount.toFixed(2))},${escapeCSV(stat.pendingOrders)},${escapeCSV(stat.pendingAmount.toFixed(2))}\n`;
        });
    } else if (selectedReportType === 'Monthly Statement') {
      
      csvContent =
        'Month,Year,Total Orders,Total Revenue (₹),Paid Orders,Paid Amount (₹),Unpaid Orders,Unpaid Amount (₹),Average Order Value (₹)\n';

      const monthStats = {};
      filteredOrders.forEach((o) => {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;

        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        const monthName = orderDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (!monthStats[monthKey]) {
          monthStats[monthKey] = {
            month: orderDate.toLocaleDateString('en-US', { month: 'short' }),
            year: orderDate.getFullYear(),
            totalOrders: 0,
            totalRevenue: 0,
            paidOrders: 0,
            paidAmount: 0,
            unpaidOrders: 0,
            unpaidAmount: 0,
          };
        }

        const amount = getOrderAmount(o);
        const status = (o.status || '').toLowerCase();

        monthStats[monthKey].totalOrders++;
        monthStats[monthKey].totalRevenue += amount;

        if (status === 'paid') {
          monthStats[monthKey].paidOrders++;
          monthStats[monthKey].paidAmount += amount;
        } else {
          monthStats[monthKey].unpaidOrders++;
          monthStats[monthKey].unpaidAmount += amount;
        }
      });

      Object.values(monthStats)
        .sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month.localeCompare(a.month);
        })
        .forEach((stat) => {
          const avgOrderValue =
            stat.totalOrders > 0 ? (stat.totalRevenue / stat.totalOrders).toFixed(2) : '0.00';
          csvContent += `${escapeCSV(stat.month)},${escapeCSV(stat.year)},${escapeCSV(stat.totalOrders)},${escapeCSV(stat.totalRevenue.toFixed(2))},${escapeCSV(stat.paidOrders)},${escapeCSV(stat.paidAmount.toFixed(2))},${escapeCSV(stat.unpaidOrders)},${escapeCSV(stat.unpaidAmount.toFixed(2))},${escapeCSV(avgOrderValue)}\n`;
        });
    } else if (selectedReportType === 'Area-wise Report' || groupByArea) {
      
      csvContent =
        'Delivery Area,Total Orders,Total Revenue (₹),Paid Orders,Paid Amount (₹),Unpaid Orders,Unpaid Amount (₹),Average Order Value (₹)\n';

      const areaStats = {};
      filteredOrders.forEach((o) => {
        const addr = o.deliveryAddress || o.customerAddress || o.address || 'Unknown';
        if (!areaStats[addr]) {
          areaStats[addr] = {
            address: addr,
            totalOrders: 0,
            totalRevenue: 0,
            paidOrders: 0,
            paidAmount: 0,
            unpaidOrders: 0,
            unpaidAmount: 0,
          };
        }

        const amount = getOrderAmount(o);
        const status = (o.status || '').toLowerCase();

        areaStats[addr].totalOrders++;
        areaStats[addr].totalRevenue += amount;

        if (status === 'paid') {
          areaStats[addr].paidOrders++;
          areaStats[addr].paidAmount += amount;
        } else {
          areaStats[addr].unpaidOrders++;
          areaStats[addr].unpaidAmount += amount;
        }
      });

      Object.values(areaStats)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .forEach((stat) => {
          const avgOrderValue =
            stat.totalOrders > 0 ? (stat.totalRevenue / stat.totalOrders).toFixed(2) : '0.00';
          csvContent += `${escapeCSV(stat.address)},${escapeCSV(stat.totalOrders)},${escapeCSV(stat.totalRevenue.toFixed(2))},${escapeCSV(stat.paidOrders)},${escapeCSV(stat.paidAmount.toFixed(2))},${escapeCSV(stat.unpaidOrders)},${escapeCSV(stat.unpaidAmount.toFixed(2))},${escapeCSV(avgOrderValue)}\n`;
        });
    } else if (selectedReportType === 'Customer Report') {
      
      csvContent =
        'Customer Address,Total Orders,Total Spent (₹),First Order Date,Last Order Date,Average Order Value (₹),Paid Orders,Unpaid Orders,Outstanding Amount (₹)\n';

      const customerStats = {};
      filteredOrders.forEach((o) => {
        const addr = o.deliveryAddress || o.customerAddress || o.address || 'Unknown';
        if (!customerStats[addr]) {
          customerStats[addr] = {
            address: addr,
            totalOrders: 0,
            totalSpent: 0,
            firstOrderDate: null,
            lastOrderDate: null,
            paidOrders: 0,
            unpaidOrders: 0,
            outstandingAmount: 0,
          };
        }

        const orderDate = parseOrderDate(o.date || o.order_date || null);
        const amount = getOrderAmount(o);
        const status = (o.status || '').toLowerCase();

        customerStats[addr].totalOrders++;
        customerStats[addr].totalSpent += amount;

        if (orderDate) {
          if (
            !customerStats[addr].firstOrderDate ||
            orderDate < customerStats[addr].firstOrderDate
          ) {
            customerStats[addr].firstOrderDate = orderDate;
          }
          if (!customerStats[addr].lastOrderDate || orderDate > customerStats[addr].lastOrderDate) {
            customerStats[addr].lastOrderDate = orderDate;
          }
        }

        if (status === 'paid') {
          customerStats[addr].paidOrders++;
        } else {
          customerStats[addr].unpaidOrders++;
          customerStats[addr].outstandingAmount += amount;
        }
      });

      Object.values(customerStats)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .forEach((stat) => {
          const avgOrderValue =
            stat.totalOrders > 0 ? (stat.totalSpent / stat.totalOrders).toFixed(2) : '0.00';
          const firstOrder = stat.firstOrderDate ? formatDate(stat.firstOrderDate) : 'N/A';
          const lastOrder = stat.lastOrderDate ? formatDate(stat.lastOrderDate) : 'N/A';

          csvContent += `${escapeCSV(stat.address)},${escapeCSV(stat.totalOrders)},${escapeCSV(stat.totalSpent.toFixed(2))},${escapeCSV(firstOrder)},${escapeCSV(lastOrder)},${escapeCSV(avgOrderValue)},${escapeCSV(stat.paidOrders)},${escapeCSV(stat.unpaidOrders)},${escapeCSV(stat.outstandingAmount.toFixed(2))}\n`;
        });
    } else if (selectedReportType === 'Growth Report') {
      
      csvContent =
        'Month,Year,Orders,Revenue (₹),Growth Rate (%),Orders Growth (%),Average Order Value (₹)\n';

      const monthStats = {};
      filteredOrders.forEach((o) => {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;

        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

        if (!monthStats[monthKey]) {
          monthStats[monthKey] = {
            month: orderDate.toLocaleDateString('en-US', { month: 'short' }),
            year: orderDate.getFullYear(),
            orders: 0,
            revenue: 0,
          };
        }

        monthStats[monthKey].orders++;
        monthStats[monthKey].revenue += getOrderAmount(o);
      });

      const sortedMonths = Object.values(monthStats).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month.localeCompare(b.month);
      });

      sortedMonths.forEach((stat, idx) => {
        const prevStat = idx > 0 ? sortedMonths[idx - 1] : null;
        const revenueGrowth =
          prevStat && prevStat.revenue > 0
            ? (((stat.revenue - prevStat.revenue) / prevStat.revenue) * 100).toFixed(2)
            : '0.00';
        const ordersGrowth =
          prevStat && prevStat.orders > 0
            ? (((stat.orders - prevStat.orders) / prevStat.orders) * 100).toFixed(2)
            : '0.00';
        const avgOrderValue = stat.orders > 0 ? (stat.revenue / stat.orders).toFixed(2) : '0.00';

        csvContent += `${escapeCSV(stat.month)},${escapeCSV(stat.year)},${escapeCSV(stat.orders)},${escapeCSV(stat.revenue.toFixed(2))},${escapeCSV(revenueGrowth)},${escapeCSV(ordersGrowth)},${escapeCSV(avgOrderValue)}\n`;
      });
    } else if (groupByMode) {
      
      csvContent = 'Mode,Total Orders,Total Revenue (₹),Average Order Value (₹)\n';

      const modeStats = {};
      filteredOrders.forEach((o) => {
        const mode = o.mode || 'Not Set';
        if (!modeStats[mode]) {
          modeStats[mode] = { mode, orders: 0, revenue: 0 };
        }
        modeStats[mode].orders++;
        modeStats[mode].revenue += getOrderAmount(o);
      });

      Object.values(modeStats)
        .sort((a, b) => b.revenue - a.revenue)
        .forEach((stat) => {
          const avgOrderValue = stat.orders > 0 ? (stat.revenue / stat.orders).toFixed(2) : '0.00';
          csvContent += `${escapeCSV(stat.mode)},${escapeCSV(stat.orders)},${escapeCSV(stat.revenue.toFixed(2))},${escapeCSV(avgOrderValue)}\n`;
        });
    } else {
      
      csvContent =
        'Order ID,Date,Delivery Address,Quantity,Unit Price (₹),Total Amount (₹),Mode,Status,Payment Mode\n';
      filteredOrders
        .sort((a, b) => {
          const dateA = parseOrderDate(a.date || a.order_date || null);
          const dateB = parseOrderDate(b.date || b.order_date || null);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateB - dateA;
        })
        .forEach((o) => {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          const dateStr = orderDate ? formatDate(orderDate) : 'N/A';
          const orderId = o.orderId || o._id || 'N/A';
          const address = o.deliveryAddress || o.customerAddress || o.address || 'N/A';
          const quantity = o.quantity || 1;
          const unitPrice = parseFloat(o.unitPrice || 0).toFixed(2);
          const totalAmount = getOrderAmount(o).toFixed(2);
          const mode = o.mode || 'N/A';
          const status = o.status || 'N/A';
          const paymentMode = o.paymentMode || 'N/A';

          csvContent += `${escapeCSV(orderId)},${escapeCSV(dateStr)},${escapeCSV(address)},${escapeCSV(quantity)},${escapeCSV(unitPrice)},${escapeCSV(totalAmount)},${escapeCSV(mode)},${escapeCSV(status)},${escapeCSV(paymentMode)}\n`;
        });
    }

    // Handle different export formats
    if (reportFormat === 'excel') {
      await handleExcelExport(filteredOrders, selectedReportType, reportDate);
    } else if (reportFormat === 'pdf') {
      await handlePDFExport(filteredOrders, selectedReportType, reportDate);
    } else {
      // CSV export (default)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedReportType.toLowerCase().replace(/\s+/g, '_')}_${reportDate}.csv`;
      link.click();
    }

    const period =
      reportDateFrom && reportDateTo
        ? `${formatDate(parseOrderDate(reportDateFrom))} - ${formatDate(parseOrderDate(reportDateTo))}`
        : 'All Time';
    setReportHistory([
      {
        id: reportHistory.length + 1,
        date: formatDateMonthDay(new Date()),
        type: selectedReportType,
        period,
      },
      ...reportHistory,
    ]);

    if (showNotification) showNotification('Report generated successfully', 'success');
    setShowGenerator(false);
  };

  const handleExcelExport = async (filteredOrders, reportType, reportDate) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(reportType);

      let headers = [];
      let rows = [];

      // Generate data based on report type (same logic as CSV)
      if (reportType === 'Sales Report') {
        headers = [
          'Order ID',
          'Date',
          'Delivery Address',
          'Quantity',
          'Unit Price (₹)',
          'Total Amount (₹)',
          'Mode',
          'Status',
          'Payment Mode',
        ];
        rows = filteredOrders
          .sort((a, b) => {
            const dateA = parseOrderDate(a.date || a.order_date || null);
            const dateB = parseOrderDate(b.date || b.order_date || null);
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB - dateA;
          })
          .map((o) => {
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            const dateStr = orderDate ? formatDate(orderDate) : 'N/A';
            return [
              o.orderId || o._id || 'N/A',
              dateStr,
              o.deliveryAddress || o.customerAddress || o.address || 'N/A',
              o.quantity || 1,
              parseFloat(o.unitPrice || 0),
              parseFloat(getOrderAmount(o)),
              o.mode || 'N/A',
              o.status || 'N/A',
              o.paymentMode || 'N/A',
            ];
          });

        // Add summary
        const totalRevenue = filteredOrders.reduce((sum, o) => sum + getOrderAmount(o), 0);
        const totalOrders = filteredOrders.length;
        const paidOrders = filteredOrders.filter(
          (o) => (o.status || '').toLowerCase() === 'paid'
        ).length;
        const unpaidOrders = filteredOrders.filter((o) => {
          const status = (o.status || '').toLowerCase();
          return status === 'unpaid' || status === 'pending';
        }).length;

        worksheet.addRow([]);
        worksheet.addRow(['Summary']);
        worksheet.addRow(['Total Orders', totalOrders]);
        worksheet.addRow(['Total Revenue (₹)', totalRevenue.toFixed(2)]);
        worksheet.addRow(['Paid Orders', paidOrders]);
        worksheet.addRow(['Unpaid Orders', unpaidOrders]);
      } else if (reportType === 'Payment Report') {
        headers = [
          'Payment Mode',
          'Total Orders',
          'Total Amount (₹)',
          'Paid Orders',
          'Paid Amount (₹)',
          'Unpaid Orders',
          'Unpaid Amount (₹)',
          'Pending Orders',
          'Pending Amount (₹)',
        ];
        const paymentStats = {};
        filteredOrders.forEach((o) => {
          const paymentMode = o.paymentMode || 'Not Set';
          if (!paymentStats[paymentMode]) {
            paymentStats[paymentMode] = {
              paymentMode,
              totalOrders: 0,
              totalAmount: 0,
              paidOrders: 0,
              paidAmount: 0,
              unpaidOrders: 0,
              unpaidAmount: 0,
              pendingOrders: 0,
              pendingAmount: 0,
            };
          }
          const amount = getOrderAmount(o);
          const status = (o.status || '').toLowerCase();
          paymentStats[paymentMode].totalOrders++;
          paymentStats[paymentMode].totalAmount += amount;
          if (status === 'paid') {
            paymentStats[paymentMode].paidOrders++;
            paymentStats[paymentMode].paidAmount += amount;
          } else if (status === 'unpaid') {
            paymentStats[paymentMode].unpaidOrders++;
            paymentStats[paymentMode].unpaidAmount += amount;
          } else {
            paymentStats[paymentMode].pendingOrders++;
            paymentStats[paymentMode].pendingAmount += amount;
          }
        });
        rows = Object.values(paymentStats)
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .map((stat) => [
            stat.paymentMode,
            stat.totalOrders,
            parseFloat(stat.totalAmount.toFixed(2)),
            stat.paidOrders,
            parseFloat(stat.paidAmount.toFixed(2)),
            stat.unpaidOrders,
            parseFloat(stat.unpaidAmount.toFixed(2)),
            stat.pendingOrders,
            parseFloat(stat.pendingAmount.toFixed(2)),
          ]);
      } else {
        // For other report types, use a simplified structure
        headers = ['Order ID', 'Date', 'Address', 'Amount (₹)', 'Status'];
        rows = filteredOrders
          .slice(0, 1000)
          .map((o) => {
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            return [
              o.orderId || o._id || 'N/A',
              orderDate ? formatDate(orderDate) : 'N/A',
              o.deliveryAddress || o.customerAddress || o.address || 'N/A',
              parseFloat(getOrderAmount(o)),
              o.status || 'N/A',
            ];
          });
      }

      // Add headers
      worksheet.addRow(headers);
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5E7EB' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows
      rows.forEach((row) => {
        worksheet.addRow(row);
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(maxLength + 2, 50);
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${reportDate}.xlsx`;
      link.click();

      if (showNotification) {
        showNotification('Excel report generated successfully', 'success');
      }
    } catch (error) {
      console.error('[ReportsTab] Excel export error:', error);
      if (showNotification) {
        showNotification('Failed to generate Excel report. Please try CSV format.', 'error');
      }
    }
  };

  const handlePDFExport = async (filteredOrders, reportType, reportDate) => {
    try {
      // For PDF, we'll create a simple HTML-based PDF using window.print or a basic implementation
      // For a proper PDF, you'd need jsPDF or pdfmake library
      // For now, we'll show a message and suggest using CSV/Excel
      if (showNotification) {
        showNotification(
          'PDF export is being prepared. For now, please use CSV or Excel format.',
          'info'
        );
      }

      // Basic PDF generation using browser print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${reportType} - ${reportDate}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                @media print { @page { margin: 1cm; } }
              </style>
            </head>
            <body>
              <h1>${reportType}</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Total Records: ${filteredOrders.length}</p>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Amount (₹)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredOrders
                    .slice(0, 100)
                    .map(
                      (o) => `
                    <tr>
                      <td>${o.orderId || o._id || 'N/A'}</td>
                      <td>${
                        parseOrderDate(o.date || o.order_date || null)
                          ? formatDate(parseOrderDate(o.date || o.order_date || null))
                          : 'N/A'
                      }</td>
                      <td>${o.deliveryAddress || o.customerAddress || o.address || 'N/A'}</td>
                      <td>${getOrderAmount(o).toFixed(2)}</td>
                      <td>${o.status || 'N/A'}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
              ${filteredOrders.length > 100 ? '<p>Showing first 100 records. Use CSV/Excel for full export.</p>' : ''}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (error) {
      console.error('[ReportsTab] PDF export error:', error);
      if (showNotification) {
        showNotification('Failed to generate PDF. Please use CSV or Excel format.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading reports...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {}
      <div className="flex-start gap-12 mb-24 flex-wrap">
        <button
          className='btn btn-primary btn-icon-inline'
          onClick={() => setShowGenerator(true)}
        >
          <i className='fa-solid fa-file-alt'></i>
          Generate Report
        </button>
        <button
          className='btn btn-secondary btn-icon-inline'
          onClick={handleGenerateReport}
          disabled={!selectedReportType}
        >
          <i className='fa-solid fa-download'></i>
          Download Report
        </button>
        <button
          className='btn btn-ghost btn-icon-inline'
          onClick={() => {
            setSelectedReportType('Sales Report');
            setShowGenerator(true);
          }}
        >
          <i className='fa-solid fa-chart-bar'></i>
          Sales Report
        </button>
        <button
          className='btn btn-ghost btn-icon-inline'
          onClick={() => {
            setSelectedReportType('Payment Report');
            setShowGenerator(true);
          }}
        >
          <i className='fa-solid fa-money-bill-wave'></i>
          Payment Report
        </button>
      </div>

      {}
      <div className='dashboard-grid-layout mb-32'>
        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card text-center'>
            <i className='fa-solid fa-chart-bar icon-32 stat-card-icon-accent icon-mb-12'></i>
            <button
              className='btn btn-primary width-full mt-8'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportType('Sales Report');
                setShowGenerator(true);
              }}
            >
              Sales Report
            </button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card text-center'>
            <i className='fa-solid fa-money-bill-wave icon-32 stat-card-icon-success icon-mb-12'></i>
            <button
              className='btn btn-primary width-full mt-8'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportType('Payment Report');
                setShowGenerator(true);
              }}
            >
              Payment Report
            </button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card text-center'>
            <i className='fa-solid fa-calendar-alt icon-32 stat-card-icon-secondary icon-mb-12'></i>
            <button
              className='btn btn-primary width-full mt-8'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportType('Monthly Statement');
                setShowGenerator(true);
              }}
            >
              Monthly Statement
            </button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card text-center'>
            <i className='fa-solid fa-map-marker-alt icon-32 stat-card-icon-accent icon-mb-12'></i>
            <button
              className='btn btn-primary width-full mt-8'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportType('Area-wise Report');
                setGroupByArea(true);
                setShowGenerator(true);
              }}
            >
              Area-wise Report
            </button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card text-center'>
            <i className='fa-solid fa-users icon-32 stat-card-icon-accent icon-mb-12'></i>
            <button
              className='btn btn-primary width-full mt-8'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportType('Customer Report');
                setShowGenerator(true);
              }}
            >
              Customer Report
            </button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card text-center'>
            <i className='fa-solid fa-chart-line icon-32 stat-card-icon-success icon-mb-12'></i>
            <button
              className='btn btn-primary width-full mt-8'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportType('Growth Report');
                setShowGenerator(true);
              }}
            >
              Growth Report
            </button>
          </div>
        </div>
      </div>

      {}
      {showGenerator && (
        <div className='modal-overlay' onClick={() => setShowGenerator(false)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Generate Report</h2>
              <button className='btn btn-ghost btn-icon modal-close' onClick={() => setShowGenerator(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Report Type</label>
                  <select
                    className='input-field'
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                  >
                    <option value=''>Select Report Type</option>
                    <option value='Sales Report'>Sales Report</option>
                    <option value='Payment Report'>Payment Report</option>
                    <option value='Monthly Statement'>Monthly Statement</option>
                    <option value='Area-wise Report'>Area-wise Report</option>
                    <option value='Customer Report'>Customer Report</option>
                    <option value='Growth Report'>Growth Report</option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Date Range</label>
                  <div className="flex-start gap-12">
                    <input
                      type='date'
                      className='input-field'
                      value={reportDateFrom}
                      onChange={(e) => setReportDateFrom(e.target.value)}
                      placeholder='From'
                    />
                    <input
                      type='date'
                      className='input-field'
                      value={reportDateTo}
                      onChange={(e) => setReportDateTo(e.target.value)}
                      placeholder='To'
                    />
                  </div>
                </div>

                <div className='form-group grid-col-full'>
                  <label>Filters</label>
                  <div className="flex-column-gap-12">
                    <label className="form-label-inline">
                      <input
                        type='checkbox'
                        checked={includeCharts}
                        onChange={(e) => setIncludeCharts(e.target.checked)}
                      />
                      <span>Include Charts</span>
                    </label>
                    <label className="form-label-inline">
                      <input
                        type='checkbox'
                        checked={includeSummary}
                        onChange={(e) => setIncludeSummary(e.target.checked)}
                      />
                      <span>Include Summary</span>
                    </label>
                    <label className="form-label-inline">
                      <input
                        type='checkbox'
                        checked={groupByArea}
                        onChange={(e) => {
                          setGroupByArea(e.target.checked);
                          if (e.target.checked) setGroupByMode(false);
                        }}
                      />
                      <span>Group by Area</span>
                    </label>
                    <label className="form-label-inline">
                      <input
                        type='checkbox'
                        checked={groupByMode}
                        onChange={(e) => {
                          setGroupByMode(e.target.checked);
                          if (e.target.checked) setGroupByArea(false);
                        }}
                      />
                      <span>Group by Mode</span>
                    </label>
                  </div>
                </div>

                <div className='form-group grid-col-full'>
                  <label>Format</label>
                  <div className="flex-start gap-16 mt-8">
                    <label className="form-label-inline">
                      <input
                        type='radio'
                        name='format'
                        value='pdf'
                        checked={reportFormat === 'pdf'}
                        onChange={(e) => setReportFormat(e.target.value)}
                      />
                      <span>PDF</span>
                    </label>
                    <label className="form-label-inline">
                      <input
                        type='radio'
                        name='format'
                        value='excel'
                        checked={reportFormat === 'excel'}
                        onChange={(e) => setReportFormat(e.target.value)}
                      />
                      <span>Excel</span>
                    </label>
                    <label className="form-label-inline">
                      <input
                        type='radio'
                        name='format'
                        value='csv'
                        checked={reportFormat === 'csv'}
                        onChange={(e) => setReportFormat(e.target.value)}
                      />
                      <span>CSV</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-ghost' onClick={() => setShowGenerator(false)}>
                Cancel
              </button>
              <button className='btn btn-secondary' onClick={handleGenerateReport}>
                <i className='fa-solid fa-file-alt'></i> Preview
              </button>
              <button className='btn btn-primary' onClick={handleGenerateReport}>
                <i className='fa-solid fa-download'></i> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className='reports-side-by-side-container' style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {}
        <div className='dashboard-card'>
          <div className="flex-between mb-16">
            <h3 className='dashboard-section-title mb-0'>
              <i className='fa-solid fa-clock opacity-70'></i>
              Automated Reports
            </h3>
            <button className='btn btn-primary btn-small'>
              <i className='fa-solid fa-plus'></i> Add Scheduled Report
            </button>
          </div>
          <div className='orders-table-container'>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Schedule</th>
                  <th>Format</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.name}</td>
                    <td>{report.schedule}</td>
                    <td>{report.format}</td>
                    <td>
                      <div className="flex-start gap-8">
                        <button className='btn btn-ghost btn-icon action-icon-edit' title='Edit'>
                          <i className='fa-solid fa-pencil'></i>
                        </button>
                        <button className='btn btn-ghost btn-icon action-icon-delete' title='Delete'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {}
        <div className='dashboard-card'>
          <h3 className='dashboard-section-title'>
            <i className='fa-solid fa-history opacity-70'></i>
            Recent Reports (Last 30 days)
          </h3>
          <div className='orders-table-container'>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Report Type</th>
                  <th>Period</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {reportHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: '48px' }}>
                      <div className='empty-state'>
                        <i className='fa-solid fa-inbox empty-state-icon'></i>
                        <p>No reports generated yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reportHistory.map((report) => (
                    <tr key={report.id}>
                      <td>{report.date}</td>
                      <td>{report.type}</td>
                      <td>{report.period}</td>
                      <td>
                        <button className='btn btn-ghost btn-icon' title='Download'>
                          <i className='fa-solid fa-download'></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportsTab;
