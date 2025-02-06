import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  TimeScale,
  ChartEvent,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
} from 'date-fns';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  TimeScale,
  Title,
  ChartTooltip,
  Legend
);

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterState {
  dateRange: DateRange;
  categories: string[];
  minAmount: string;
  maxAmount: string;
}

const Reports = () => {
  const theme = useTheme();
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const categories = useSelector((state: RootState) => state.categories.items);
  const userPreferences = useSelector((state: RootState) => state.user.currentUser?.preferences);
  const currency = userPreferences?.defaultCurrency || 'USD';

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      startDate: startOfMonth(subMonths(new Date(), 5)),
      endDate: endOfMonth(new Date()),
    },
    categories: [],
    minAmount: '',
    maxAmount: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      const amount = expense.amount;

      // Date range filter
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        if (!isWithinInterval(expenseDate, {
          start: startOfDay(filters.dateRange.startDate),
          end: endOfDay(filters.dateRange.endDate),
        })) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(expense.categoryId)) {
        return false;
      }

      // Amount range filter
      if (filters.minAmount && amount < parseFloat(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && amount > parseFloat(filters.maxAmount)) {
        return false;
      }

      return true;
    });
  }, [expenses, filters]);

  // Calculate various statistics
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgPerDay = total / (filteredExpenses.length || 1);
    
    const categoryTotals = categories.reduce((acc, cat) => {
      acc[cat.id] = filteredExpenses
        .filter(exp => exp.categoryId === cat.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return acc;
    }, {} as { [key: string]: number });

    return {
      total,
      avgPerDay,
      categoryTotals,
    };
  }, [filteredExpenses, categories]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Monthly trend data
    const monthlyData = eachMonthOfInterval({
      start: filters.dateRange.startDate || new Date(),
      end: filters.dateRange.endDate || new Date(),
    }).map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const total = filteredExpenses
        .filter(exp => isWithinInterval(parseISO(exp.date), { start: monthStart, end: monthEnd }))
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        month: format(month, 'MMM yyyy'),
        total,
      };
    });

    // Category distribution data
    const categoryData = categories.map(category => ({
      category: category.name,
      total: stats.categoryTotals[category.id] || 0,
      color: category.color,
    }));

    return {
      monthly: monthlyData,
      category: categoryData,
    };
  }, [filteredExpenses, categories, filters.dateRange, stats.categoryTotals]);

  // Check if there's data to display
  const hasExpenses = expenses.length > 0;
  const hasCategories = categories.length > 0;

  const monthlyData = hasExpenses ? chartData.monthly : [];
  const categoryData = hasExpenses && hasCategories ? chartData.category : [];

  // Line chart data
  const lineChartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.map(data => data.total),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        tension: 0.4,
      },
    ],
  };

  // Pie chart data
  const pieChartData = {
    labels: categoryData.map(data => data.category),
    datasets: [
      {
        data: categoryData.map(data => data.total),
        backgroundColor: categoryData.map((_, index) => 
          theme.palette.augmentColor({
            color: {
              main: `hsl(${(index * 360) / categoryData.length}, 70%, 50%)`,
            },
          }).main
        ),
      },
    ],
  };

  // Bar chart data
  const barChartData = {
    labels: categoryData.map(data => data.category),
    datasets: [
      {
        label: 'Category Expenses',
        data: categoryData.map(data => data.total),
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  // Chart options with empty state message
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !hasExpenses,
        text: 'No expense data available',
        color: theme.palette.text.secondary,
      },
    },
  };

  // Handle filter changes
  const handleDateRangeChange = (type: 'startDate' | 'endDate') => (date: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: date,
      },
    }));
  };

  const handleCategoryChange = (event: any) => {
    setFilters(prev => ({
      ...prev,
      categories: event.target.value,
    }));
  };

  const handleAmountChange = (type: 'minAmount' | 'maxAmount') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [type]: event.target.value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        startDate: startOfMonth(subMonths(new Date(), 5)),
        endDate: endOfMonth(new Date()),
      },
      categories: [],
      minAmount: '',
      maxAmount: '',
    });
  };

  // Export functions
  const exportToPDF = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Expense Report', 20, 20);
      
      // Add date range
      doc.setFontSize(12);
      doc.text(
        `Period: ${format(filters.dateRange.startDate || new Date(), 'MMM dd, yyyy')} - ${format(filters.dateRange.endDate || new Date(), 'MMM dd, yyyy')}`,
        20,
        30
      );

      // Add summary
      doc.text(`Total Expenses: ${currency} ${stats.total.toFixed(2)}`, 20, 40);
      doc.text(`Average Daily Expense: ${currency} ${stats.avgPerDay.toFixed(2)}`, 20, 50);

      // Add category breakdown
      const categoryData = chartData.category
        .filter(cat => cat.total > 0)
        .map(cat => [cat.category, `${currency} ${cat.total.toFixed(2)}`]);

      doc.autoTable({
        head: [['Category', 'Amount']],
        body: categoryData,
        startY: 60,
      });

      doc.save(`expense-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      setMessage({ type: 'success', text: 'PDF exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export PDF. Please try again.' });
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    setLoading(true);
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredExpenses.map(expense => ({
        Date: format(parseISO(expense.date), 'MMM dd, yyyy'),
        Category: categories.find(cat => cat.id === expense.categoryId)?.name || 'Unknown',
        Amount: `${currency} ${expense.amount.toFixed(2)}`,
        Notes: expense.notes || '',
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
      
      XLSX.writeFile(workbook, `expense-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      setMessage({ type: 'success', text: 'Excel file exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export Excel file. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Export as PDF">
            <IconButton onClick={exportToPDF} disabled={loading}>
              <PdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export as Excel">
            <IconButton onClick={exportToExcel} disabled={loading}>
              <ExcelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Filters">
            <IconButton onClick={resetFilters} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filters.dateRange.startDate}
                onChange={handleDateRangeChange('startDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={filters.dateRange.endDate}
                onChange={handleDateRangeChange('endDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={filters.categories}
                onChange={handleCategoryChange}
                label="Categories"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min Amount"
                  type="number"
                  value={filters.minAmount}
                  onChange={handleAmountChange('minAmount')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Amount"
                  type="number"
                  value={filters.maxAmount}
                  onChange={handleAmountChange('maxAmount')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Expenses
                </Typography>
                <Typography variant="h4">
                  {currency} {stats.total.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Daily Expense
                </Typography>
                <Typography variant="h4">
                  {currency} {stats.avgPerDay.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Number of Transactions
                </Typography>
                <Typography variant="h4">
                  {filteredExpenses.length}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Expenses Trend
            </Typography>
            {hasExpenses ? (
              <Line data={lineChartData} options={chartOptions} />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">
                  No expense data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Expense Distribution by Category
            </Typography>
            {hasExpenses && hasCategories ? (
              <Pie data={pieChartData} options={chartOptions} />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">
                  {!hasCategories
                    ? 'No categories available'
                    : 'No expense data available'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Category Comparison
            </Typography>
            {hasExpenses && hasCategories ? (
              <Bar data={barChartData} options={chartOptions} />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">
                  {!hasCategories
                    ? 'No categories available'
                    : 'No expense data available'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.type}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports; 