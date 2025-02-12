import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Button, useTheme } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import DownloadIcon from '@mui/icons-material/Download';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('6');
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);

  // Calculate monthly expenses
  const calculateMonthlyExpenses = () => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), parseInt(timeRange) - 1),
      end: new Date(),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthlyTotal = expenses.reduce((total, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate >= monthStart && expenseDate <= monthEnd) {
          return total + expense.amount;
        }
        return total;
      }, 0);

      return {
        month: format(month, 'MMM yyyy'),
        total: monthlyTotal,
      };
    });
  };

  // Calculate category expenses
  const calculateCategoryExpenses = () => {
    const categoryTotals = categories.map(category => {
      const total = expenses.reduce((sum, expense) => {
        if (expense.categoryId === category.id) {
          return sum + expense.amount;
        }
        return sum;
      }, 0);

      return {
        category: category.name,
        total,
      };
    });

    return categoryTotals.sort((a, b) => b.total - a.total);
  };

  const monthlyData = calculateMonthlyExpenses();
  const categoryData = calculateCategoryExpenses();

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

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Handle data export
  const handleExport = () => {
    const exportData = {
      totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      monthlyExpenses: monthlyData,
      categoryExpenses: categoryData,
      summary: {
        timeRange: `Last ${timeRange} months`,
        totalCategories: categories.length,
        averageMonthlyExpense: monthlyData.reduce((sum, data) => sum + data.total, 0) / monthlyData.length,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Financial Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="3">Last 3 months</MenuItem>
              <MenuItem value="6">Last 6 months</MenuItem>
              <MenuItem value="12">Last 12 months</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Monthly Expenses Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Expenses Trend
            </Typography>
            <Line data={lineChartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Expense Distribution by Category
            </Typography>
            <Pie data={pieChartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Category Comparison */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Category Comparison
            </Typography>
            <Bar data={barChartData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 