import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addSavingsGoal, updateGoal, deleteGoal } from '../../features/savings/savingsSlice';
import { v4 as uuidv4 } from 'uuid';
import { SavingsGoal } from '../../types';

const SavingsGoals = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.savings.goals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setNewGoalName(goal.name);
    setNewGoalAmount(goal.targetAmount.toString());
    setNewGoalDate(goal.targetDate);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (goal: SavingsGoal) => {
    dispatch(deleteGoal(goal.id));
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedGoal(null);
    setNewGoalName('');
    setNewGoalAmount('');
    setNewGoalDate('');
  };

  const handleAddGoal = () => {
    if (!newGoalName || !newGoalAmount || !newGoalDate) return;

    const newGoal: SavingsGoal = {
      id: uuidv4(),
      name: newGoalName,
      targetAmount: parseFloat(newGoalAmount),
      currentAmount: 0,
      targetDate: newGoalDate,
    };

    dispatch(addSavingsGoal(newGoal));
    handleDialogClose();
  };

  const handleEditSubmit = () => {
    if (!selectedGoal || !newGoalName || !newGoalAmount || !newGoalDate) return;

    const updatedGoal: SavingsGoal = {
      ...selectedGoal,
      name: newGoalName,
      targetAmount: parseFloat(newGoalAmount),
      targetDate: newGoalDate,
    };

    dispatch(updateGoal(updatedGoal));
    handleDialogClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Savings Goals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {goal.name}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress: {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(goal.currentAmount / goal.targetAmount) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Typography variant="body1">
                ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button size="small" onClick={() => handleEditClick(goal)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDeleteClick(goal)}>
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
        {goals.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No savings goals yet. Create one to start tracking your progress!
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={isAddDialogOpen || isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {isEditDialogOpen ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name"
            fullWidth
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Target Amount"
            type="number"
            fullWidth
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Target Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newGoalDate}
            onChange={(e) => setNewGoalDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={isEditDialogOpen ? handleEditSubmit : handleAddGoal}>
            {isEditDialogOpen ? 'Save Changes' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsGoals; 