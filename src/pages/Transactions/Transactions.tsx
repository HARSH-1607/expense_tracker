import {
  Box,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import ExpenseCard from '../../components/ExpenseCard/ExpenseCard';
import { deleteExpense } from '../../features/expenses/expensesSlice';

const Transactions = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    dispatch(deleteExpense(id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Transactions</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Transaction
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={() => {}}
              onDelete={() => handleDelete(expense.id)}
            />
          ))}
          {expenses.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center">
              No transactions found
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Transactions; 