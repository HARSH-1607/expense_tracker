import {
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';

interface CategoryCardProps {
  title: string;
  amount: number;
  color: string;
}

export const CategoryCard = ({ title, amount, color }: CategoryCardProps) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1" sx={{ color: color }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          ${amount.toFixed(2)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={100}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: color + '20',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
};

export default CategoryCard; 