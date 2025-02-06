import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format, isAfter, isBefore } from 'date-fns';
import { SavingsGoal } from '../../types';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit?: () => void;
  onDelete?: () => void;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.();
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.();
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const isOverdue =
    goal.deadline && isBefore(new Date(goal.deadline), new Date()) && !isCompleted;

  const getStatusColor = () => {
    if (isCompleted) return theme.palette.success.main;
    if (isOverdue) return theme.palette.error.main;
    if (progress >= 75) return theme.palette.success.main;
    if (progress >= 50) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `4px solid ${getStatusColor()}`,
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                backgroundColor: getStatusColor(),
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: getStatusColor(),
                },
              }}
              size="small"
            >
              <FlagIcon />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                {goal.name}
              </Typography>
              {goal.deadline && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography variant="h6" component="div" color="primary">
                {currencySymbols[goal.currency] || goal.currency}
                {goal.currentAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {currencySymbols[goal.currency] || goal.currency}
                {goal.targetAmount.toFixed(2)}
              </Typography>
            </Box>
            <IconButton
              aria-label="goal actions"
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.min(progress, 100).toFixed(1)}%
            </Typography>
          </Box>
          <Tooltip title={`${progress.toFixed(1)}% completed`}>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(),
                  borderRadius: 4,
                },
              }}
            />
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}; 