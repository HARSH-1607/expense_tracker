import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { Category } from '../../types';
import * as Icons from '@mui/icons-material';

interface CategoryCardProps {
  category: Category;
  onEdit?: () => void;
  onDelete?: () => void;
  totalExpenses?: number;
  currency?: string;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  totalExpenses = 0,
  currency = 'USD',
}) => {
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

  // Dynamically get the icon component
  const IconComponent = category.icon
    ? Icons[category.icon as keyof typeof Icons]
    : Icons.Category;

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `4px solid ${category.color}`,
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
                backgroundColor: category.color,
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: category.color,
                },
              }}
              size="small"
            >
              {IconComponent && <IconComponent />}
            </IconButton>
            <Box>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Expenses: {currencySymbols[currency] || currency}
                {totalExpenses.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <IconButton
            aria-label="category actions"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
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