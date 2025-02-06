import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { Expense } from '../../types';
import * as Icons from '@mui/icons-material';

interface ExpenseCardProps {
  expense: Expense;
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

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const categories = useSelector((state: RootState) => state.categories.items);
  const category = categories.find((cat) => cat.id === expense.categoryId);

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

  // Dynamically get the icon component for the category
  const IconComponent = category?.icon
    ? Icons[category.icon as keyof typeof Icons]
    : Icons.Receipt;

  return (
    <Card
      sx={{
        mb: 2,
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
                backgroundColor: category?.color || theme.palette.grey[300],
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: category?.color || theme.palette.grey[300],
                },
              }}
              size="small"
            >
              {IconComponent && <IconComponent />}
            </IconButton>
            <Box>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                {category?.name || 'Uncategorized'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ mr: 1, color: theme.palette.expense.main }}
            >
              {currencySymbols[expense.currency] || expense.currency}
              {expense.amount.toFixed(2)}
            </Typography>
            <IconButton
              aria-label="expense actions"
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {expense.notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
          >
            {expense.notes}
          </Typography>
        )}

        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          {expense.isRecurring && (
            <Chip
              icon={<RepeatIcon />}
              label={`Recurring ${expense.recurringFrequency}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
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