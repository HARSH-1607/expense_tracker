import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { RootState } from '../../store';
import { Expense } from '../../types';
import 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  BarElement
);

const Reports = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [timeRange, setTimeRange] = useState('month');

  const getChartData = useMemo(() => {
    const monthlyData = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
      return acc;
    }, {});

    const categoryData = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
      const category = categories.find(cat => cat.id === expense.categoryId)?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    return {
      monthly: {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Monthly Expenses',
          data: Object.values(monthlyData),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 2,
        }],
      },
      category: {
        labels: Object.keys(categoryData),
        datasets: [{
          label: 'Expenses by Category',
          data: Object.values(categoryData),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        }],
      },
    };
  }, [expenses, categories]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Expense Reports
        </Typography>
        <Select
          value={timeRange}
          onChange={(e: SelectChangeEvent) => setTimeRange(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="week">Last Week</MenuItem>
          <MenuItem value="month">Last Month</MenuItem>
          <MenuItem value="year">Last Year</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Expenses Trend
            </Typography>
            <Line data={getChartData.monthly} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            <Pie data={getChartData.category} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 400, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Category Comparison
            </Typography>
            <Bar data={getChartData.category} options={chartOptions} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 