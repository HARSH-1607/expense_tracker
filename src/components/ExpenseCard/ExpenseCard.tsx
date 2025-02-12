import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Expense, Category } from '../../types';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const category = categories.find((cat: Category) => cat.id === expense.categoryId);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    onEdit(expense);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    onDelete(expense.id);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="div">
              {expense.description}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {category?.name || 'Uncategorized'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format(new Date(expense.date), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div" sx={{ mr: 1 }}>
              ${expense.amount.toFixed(2)}
            </Typography>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard; 