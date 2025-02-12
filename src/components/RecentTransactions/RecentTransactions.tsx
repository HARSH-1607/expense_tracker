import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { RootState } from '../../store';
import { format } from 'date-fns';

export const RecentTransactions = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);

  const recentTransactions = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <List>
      {recentTransactions.map((transaction) => {
        const category = categories.find(cat => cat.id === transaction.categoryId);
        
        return (
          <ListItem key={transaction.id} divider>
            <ListItemText
              primary={transaction.description}
              secondary={
                <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="body2" component="span">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </Typography>
                  {category && (
                    <Chip
                      label={category.name}
                      size="small"
                      sx={{
                        backgroundColor: category.color + '20',
                        color: category.color,
                      }}
                    />
                  )}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Typography
                variant="body1"
                color="error"
                sx={{ fontWeight: 'medium' }}
              >
                -${transaction.amount.toFixed(2)}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      {recentTransactions.length === 0 && (
        <ListItem>
          <ListItemText
            primary="No recent transactions"
            secondary="Add your first expense to see it here"
          />
        </ListItem>
      )}
    </List>
  );
};

export default RecentTransactions; 