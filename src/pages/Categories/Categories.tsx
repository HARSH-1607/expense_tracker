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
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features/store';
import { CategoryCard } from '../../components/CategoryCard/CategoryCard';
import { CategoryForm } from '../../components/CategoryForm/CategoryForm';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../features/categories/categoriesSlice';
import { Category } from '../../types';

const Categories = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.items);
  const expenses = useSelector((state: RootState) => state.expenses.items);
  const userPreferences = useSelector(
    (state: RootState) => state.user.currentUser?.preferences
  );

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = (categoryData: Omit<Category, 'id'>) => {
    try {
      dispatch(addCategory(categoryData));
      setIsAddDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add category. Please try again.');
    }
  };

  const handleEditSubmit = (categoryData: Omit<Category, 'id'>) => {
    if (selectedCategory) {
      try {
        dispatch(
          updateCategory({
            ...categoryData,
            id: selectedCategory.id,
          })
        );
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        setError(null);
      } catch (err) {
        setError('Failed to update category. Please try again.');
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      try {
        dispatch(deleteCategory(selectedCategory.id));
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  const calculateCategoryTotal = (categoryId: string) => {
    return expenses
      .filter((expense) => expense.categoryId === categoryId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

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
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <CategoryCard
              category={category}
              onEdit={() => handleEditClick(category)}
              onDelete={() => handleDeleteClick(category)}
              totalExpenses={calculateCategoryTotal(category.id)}
              currency={userPreferences?.defaultCurrency || 'USD'}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add Category Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add New Category
            <IconButton onClick={() => setIsAddDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CategoryForm onSubmit={handleAddSubmit} />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Category
            <IconButton onClick={() => setIsEditDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <CategoryForm
              onSubmit={handleEditSubmit}
              initialValues={selectedCategory}
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
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be
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
    </Box>
  );
};

export default Categories; 