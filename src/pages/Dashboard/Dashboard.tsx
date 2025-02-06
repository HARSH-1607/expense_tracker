import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  useTheme,
  Paper,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Savings,
  Category,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { StatsCard } from '../../components/StatsCard/StatsCard';
import { ExpenseCard } from '../../components/ExpenseCard/ExpenseCard';
import { SavingsGoalCard } from '../../components/SavingsGoalCard/SavingsGoalCard';
import { format, subDays, isAfter } from 'date-fns';

const Dashboard = () => {
  const theme = useTheme();
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const categories = useSelector((state: RootState) => state.categories.items);
  const savingsGoals = useSelector((state: RootState) => state.savings.goals);
  const userPreferences = useSelector(
    (state: RootState) => state.user.currentUser?.preferences
  );

  const currency = userPreferences?.defaultCurrency || 'USD';

  // Calculate total expenses for the current month
  const currentDate = new Date();
  const currentMonthExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date).getMonth() === currentDate.getMonth() &&
      new Date(expense.date).getFullYear() === currentDate.getFullYear()
  );

  const totalCurrentMonth = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate total expenses for the previous month
  const previousMonthExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date).getMonth() === currentDate.getMonth() - 1 &&
      new Date(expense.date).getFullYear() === currentDate.getFullYear()
  );

  const totalPreviousMonth = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate trend
  const expenseTrend = totalPreviousMonth
    ? ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100
    : 0;

  // Get recent transactions
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get active savings goals
  const activeGoals = savingsGoals
    .filter(
      (goal) =>
        !goal.deadline || isAfter(new Date(goal.deadline), new Date())
    )
    .slice(0, 3);

  // Calculate category statistics
  const categoryStats = categories.map((category) => {
    const categoryExpenses = currentMonthExpenses.filter(
      (expense) => expense.categoryId === category.id
    );
    return {
      ...category,
      total: categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    };
  });

  const topCategories = [...categoryStats]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Welcome back!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Monthly Expenses"
            value={`${currency} ${totalCurrentMonth.toFixed(2)}`}
            icon={AccountBalance}
            trend={{
              value: Math.round(expenseTrend * 100) / 100,
              isPositive: expenseTrend <= 0,
            }}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Top Category"
            value={topCategories[0]?.name || 'No expenses'}
            icon={Category}
            subtitle={`${currency} ${topCategories[0]?.total.toFixed(2) || '0.00'}`}
            color={theme.palette.secondary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Daily Average"
            value={`${currency} ${(totalCurrentMonth / 30).toFixed(2)}`}
            icon={TrendingUp}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Goals"
            value={activeGoals.length}
            icon={Savings}
            subtitle="Track your savings progress"
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Transactions
            </Typography>
            {recentTransactions.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                href="/transactions"
              >
                View All Transactions
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Active Savings Goals
            </Typography>
            {activeGoals.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                href="/savings"
              >
                View All Goals
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top Spending Categories
            </Typography>
            {topCategories.map((category) => (
              <Box key={category.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{category.name}</Typography>
                  <Typography>
                    {currency} {category.total.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 4,
                    backgroundColor: theme.palette.grey[200],
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(category.total / totalCurrentMonth) * 100}%`,
                      height: '100%',
                      backgroundColor: category.color,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 