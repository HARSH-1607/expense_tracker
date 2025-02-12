import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SavingsGoal } from '../../types';

interface SavingsGoalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  initialValues?: SavingsGoal;
}

const SavingsGoalForm = ({ open, onClose, onSubmit, initialValues }: SavingsGoalFormProps) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialValues?.targetAmount || 0);
  const [targetDate, setTargetDate] = useState<Date | null>(
    initialValues?.targetDate ? new Date(initialValues.targetDate) : new Date()
  );
  const [description, setDescription] = useState(initialValues?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetDate) {
      onSubmit({
        name,
        targetAmount,
        targetDate: targetDate.toISOString(),
        description,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialValues ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Target Amount"
            type="number"
            fullWidth
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            required
          />
          <DatePicker
            label="Target Date"
            value={targetDate}
            onChange={(newDate) => setTargetDate(newDate)}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SavingsGoalForm; 