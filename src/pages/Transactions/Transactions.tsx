import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  IconButton,
  DialogActions,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features/store';
import { ExpenseCard } from '../../components/ExpenseCard/ExpenseCard';
import { ExpenseForm } from '../../components/ExpenseForm/ExpenseForm';
import {
  addExpense,
  updateExpense,
  deleteExpense,
  setExpensesFilters,
  clearExpensesFilters,
} from '../../features/expenses/expensesSlice';
import { Expense } from '../../types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isWithinInterval, parseISO } from 'date-fns';

const Transactions = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const filters = useSelector((state: RootState) => state.expenses.filters);
  const categories = useSelector((state: RootState) => state.categories.items);

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = (expenseData: Omit<Expense, 'id'>) => {
    try {
      dispatch(addExpense(expenseData));
      setIsAddDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleEditSubmit = (expenseData: Omit<Expense, 'id'>) => {
    if (selectedExpense) {
      try {
        dispatch(
          updateExpense({
            ...expenseData,
            id: selectedExpense.id,
          })
        );
        setIsEditDialogOpen(false);
        setSelectedExpense(null);
        setError(null);
      } catch (err) {
        setError('Failed to update expense. Please try again.');
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedExpense) {
      try {
        dispatch(deleteExpense(selectedExpense.id));
        setIsDeleteDialogOpen(false);
        setSelectedExpense(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleFilterSubmit = () => {
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    dispatch(clearExpensesFilters());
    setSearchQuery('');
  };

  const filteredExpenses = expenses
    .filter((expense) => {
      // Apply search query
      if (searchQuery) {
        const category = categories.find((cat) => cat.id === expense.categoryId);
        const searchString = `${category?.name} ${expense.notes}`.toLowerCase();
        if (!searchString.includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      // Apply date range filter
      if (filters.startDate && filters.endDate) {
        const expenseDate = parseISO(expense.date);
        if (
          !isWithinInterval(expenseDate, {
            start: parseISO(filters.startDate),
            end: parseISO(filters.endDate),
          })
        ) {
          return false;
        }
      }

      // Apply category filter
      if (filters.categoryId && expense.categoryId !== filters.categoryId) {
        return false;
      }

      // Apply amount range filter
      if (
        (filters.minAmount !== null && expense.amount < filters.minAmount) ||
        (filters.maxAmount !== null && expense.amount > filters.maxAmount)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Transaction
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setIsFilterDialogOpen(true)}
              >
                Filters
              </Button>
              {(filters.startDate ||
                filters.endDate ||
                filters.categoryId ||
                filters.minAmount ||
                filters.maxAmount) && (
                <Button color="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2 }}>
        {filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={() => handleEditClick(expense)}
            onDelete={() => handleDeleteClick(expense)}
          />
        ))}
        {filteredExpenses.length === 0 && (
          <Typography color="text.secondary" align="center">
            No transactions found.
          </Typography>
        )}
      </Box>

      {/* Add Transaction Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add New Transaction
            <IconButton onClick={() => setIsAddDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ExpenseForm onSubmit={handleAddSubmit} />
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Transaction
            <IconButton onClick={() => setIsEditDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <ExpenseForm
              onSubmit={handleEditSubmit}
              initialValues={selectedExpense}
              submitButtonText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Filter Transactions
            <IconButton onClick={() => setIsFilterDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.categoryId || ''}
                    onChange={(e) =>
                      dispatch(
                        setExpensesFilters({ categoryId: e.target.value || null })
                      )
                    }
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate ? parseISO(filters.startDate) : null}
                    onChange={(date) =>
                      dispatch(
                        setExpensesFilters({
                          startDate: date ? format(date, 'yyyy-MM-dd') : null,
                        })
                      )
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate ? parseISO(filters.endDate) : null}
                    onChange={(date) =>
                      dispatch(
                        setExpensesFilters({
                          endDate: date ? format(date, 'yyyy-MM-dd') : null,
                        })
                      )
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  value={filters.minAmount || ''}
                  onChange={(e) =>
                    dispatch(
                      setExpensesFilters({
                        minAmount: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    )
                  }
                  inputProps={{ step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  value={filters.maxAmount || ''}
                  onChange={(e) =>
                    dispatch(
                      setExpensesFilters({
                        maxAmount: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    )
                  }
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters}>Clear All</Button>
          <Button onClick={handleFilterSubmit} variant="contained" color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions; 