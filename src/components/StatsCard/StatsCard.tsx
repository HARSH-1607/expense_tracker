import {
  Box,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Category as CategoryIcon,
} from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: number;
  type: 'total' | 'monthly' | 'categories';
}

export const StatsCard = ({ title, value, type }: StatsCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'total':
        return <TrendingUp />;
      case 'monthly':
        return <AccountBalance />;
      case 'categories':
        return <CategoryIcon />;
      default:
        return <TrendingUp />;
    }
  };

  const formatValue = () => {
    if (type === 'categories') {
      return value;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton color="primary" sx={{ mr: 1 }}>
          {getIcon()}
        </IconButton>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="h4">
        {formatValue()}
      </Typography>
    </Paper>
  );
};

export default StatsCard; 