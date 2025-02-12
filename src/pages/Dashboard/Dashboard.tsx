import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import { RootState } from '../../store';
import { StatsCard } from '../../components/StatsCard/StatsCard';
import { CategoryCard } from '../../components/CategoryCard/CategoryCard';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import { isAfter } from 'date-fns';

const Dashboard = () => {
  const theme = useTheme();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const user = useSelector((state: RootState) => state.user.user);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate monthly expenses
  const currentDate = new Date();
  const monthlyExpenses = expenses
    .filter(expense => isAfter(new Date(expense.date), new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)))
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Get top categories
  const categoryTotals = expenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const topCategories = Object.entries(categoryTotals)
    .map(([categoryId, total]) => ({
      category: categories.find(cat => cat.id === categoryId),
      total,
    }))
    .filter(item => item.category)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'User'}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Expenses"
            value={totalExpenses}
            type="total"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Monthly Expenses"
            value={monthlyExpenses}
            type="monthly"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Categories"
            value={categories.length}
            type="categories"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <RecentTransactions />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Categories
            </Typography>
            <Box sx={{ mt: 2 }}>
              {topCategories.map((item) => (
                item.category && (
                  <CategoryCard
                    key={item.category.id}
                    title={item.category.name}
                    amount={item.total}
                    color={item.category.color || theme.palette.primary.main}
                  />
                )
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 