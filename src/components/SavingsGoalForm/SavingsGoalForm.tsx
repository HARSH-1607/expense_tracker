import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SavingsGoal } from '../../types';

interface SavingsGoalFormProps {
  onSubmit: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  initialValues?: SavingsGoal;
  submitButtonText?: string;
}

export const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText = 'Add Savings Goal',
}) => {
  const [name, setName] = React.useState(initialValues?.name || '');
  const [targetAmount, setTargetAmount] = React.useState(
    initialValues?.targetAmount?.toString() || ''
  );
  const [deadline, setDeadline] = React.useState<Date | null>(
    initialValues?.deadline ? new Date(initialValues.deadline) : null
  );
  const [currency, setCurrency] = React.useState(initialValues?.currency || 'USD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      targetAmount: parseFloat(targetAmount),
      deadline: deadline?.toISOString(),
      currency,
    });
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Target Amount"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Target Date (Optional)"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

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