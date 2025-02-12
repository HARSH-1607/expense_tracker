import { useState } from 'react';
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
import { format } from 'date-fns';
import { SavingsGoal } from '../../types';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

const SavingsGoalCard = ({ goal, onEdit, onDelete }: SavingsGoalCardProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    onEdit(goal);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    onDelete(goal.id);
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const getStatusColor = () => {
    if (isCompleted) return theme.palette.success.main;
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography variant="h6" component="div" color="primary">
                ${goal.currentAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of ${goal.targetAmount.toFixed(2)}
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
          <MenuItem onClick={handleEditClick}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: theme.palette.error.main }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default SavingsGoalCard; 