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
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features/store';
import { SavingsGoalCard } from '../../components/SavingsGoalCard/SavingsGoalCard';
import { SavingsGoalForm } from '../../components/SavingsGoalForm/SavingsGoalForm';
import {
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  updateGoalProgress,
} from '../../features/savings/savingsSlice';
import { SavingsGoal } from '../../types';

const SavingsGoals = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.savings.goals);
  const userPreferences = useSelector(
    (state: RootState) => state.user.currentUser?.preferences
  );

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isUpdateProgressDialogOpen, setIsUpdateProgressDialogOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<SavingsGoal | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [progressAmount, setProgressAmount] = React.useState('');

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateProgressClick = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setProgressAmount('');
    setIsUpdateProgressDialogOpen(true);
  };

  const handleAddSubmit = (goalData: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    try {
      dispatch(addSavingsGoal(goalData));
      setIsAddDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add savings goal. Please try again.');
    }
  };

  const handleEditSubmit = (goalData: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    if (selectedGoal) {
      try {
        dispatch(
          updateSavingsGoal({
            ...goalData,
            id: selectedGoal.id,
            currentAmount: selectedGoal.currentAmount,
          })
        );
        setIsEditDialogOpen(false);
        setSelectedGoal(null);
        setError(null);
      } catch (err) {
        setError('Failed to update savings goal. Please try again.');
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedGoal) {
      try {
        dispatch(deleteSavingsGoal(selectedGoal.id));
        setIsDeleteDialogOpen(false);
        setSelectedGoal(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete savings goal. Please try again.');
      }
    }
  };

  const handleUpdateProgressSubmit = () => {
    if (selectedGoal && progressAmount) {
      try {
        dispatch(
          updateGoalProgress({
            goalId: selectedGoal.id,
            amount: parseFloat(progressAmount),
            isAddition: true,
          })
        );
        setIsUpdateProgressDialogOpen(false);
        setSelectedGoal(null);
        setProgressAmount('');
        setError(null);
      } catch (err) {
        setError('Failed to update progress. Please try again.');
      }
    }
  };

  const filteredGoals = goals
    .filter((goal) => {
      if (searchQuery) {
        return goal.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by completion percentage (descending)
      const aProgress = (a.currentAmount / a.targetAmount) * 100;
      const bProgress = (b.currentAmount / b.targetAmount) * 100;
      return bProgress - aProgress;
    });

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
        <Typography variant="h4">Savings Goals</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Goal
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search goals..."
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
      </Paper>

      <Grid container spacing={2}>
        {filteredGoals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal.id}>
            <SavingsGoalCard
              goal={goal}
              onEdit={() => handleEditClick(goal)}
              onDelete={() => handleDeleteClick(goal)}
            />
          </Grid>
        ))}
        {filteredGoals.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              No savings goals found.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Add Goal Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add New Savings Goal
            <IconButton onClick={() => setIsAddDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <SavingsGoalForm onSubmit={handleAddSubmit} />
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Savings Goal
            <IconButton onClick={() => setIsEditDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedGoal && (
            <SavingsGoalForm
              onSubmit={handleEditSubmit}
              initialValues={selectedGoal}
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
        <DialogTitle>Delete Savings Goal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedGoal?.name}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog
        open={isUpdateProgressDialogOpen}
        onClose={() => setIsUpdateProgressDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={progressAmount}
              onChange={(e) => setProgressAmount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {selectedGoal?.currency || userPreferences?.defaultCurrency || '$'}
                  </InputAdornment>
                ),
                inputProps: { step: '0.01', min: '0' },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateProgressDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateProgressSubmit}
            color="primary"
            variant="contained"
            disabled={!progressAmount || parseFloat(progressAmount) <= 0}
          >
            Update Progress
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsGoals; 