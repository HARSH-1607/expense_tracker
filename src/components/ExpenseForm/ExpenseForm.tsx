import React from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { Expense } from '../../types';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  initialValues?: Expense;
  submitButtonText?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText = 'Add Expense',
}) => {
  const categories = useSelector((state: RootState) => state.categories.items);
  const [amount, setAmount] = React.useState(initialValues?.amount?.toString() || '');
  const [categoryId, setCategoryId] = React.useState(initialValues?.categoryId || '');
  const [date, setDate] = React.useState<Date | null>(
    initialValues?.date ? new Date(initialValues.date) : new Date()
  );
  const [notes, setNotes] = React.useState(initialValues?.notes || '');
  const [currency, setCurrency] = React.useState(initialValues?.currency || 'USD');
  const [isRecurring, setIsRecurring] = React.useState(initialValues?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = React.useState(
    initialValues?.recurringFrequency || 'monthly'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      categoryId,
      date: date?.toISOString() || new Date().toISOString(),
      notes,
      currency,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryId(event.target.value);
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  const handleRecurringFrequencyChange = (event: SelectChangeEvent) => {
    setRecurringFrequency(event.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ step: '0.01', min: '0' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Currency</InputLabel>
            <Select value={currency} onChange={handleCurrencyChange} label="Currency">
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="INR">INR (₹)</MenuItem>
              <MenuItem value="JPY">JPY (¥)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select value={categoryId} onChange={handleCategoryChange} label="Category">
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
            }
            label="Recurring Expense"
          />
        </Grid>

        {isRecurring && (
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={recurringFrequency}
                onChange={handleRecurringFrequencyChange}
                label="Frequency"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            {submitButtonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}; 