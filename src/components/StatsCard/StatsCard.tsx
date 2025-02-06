import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: SvgIconComponent;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  color,
}) => {
  const theme = useTheme();

  const cardColor = color || theme.palette.primary.main;

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          opacity: 0.1,
          transform: 'rotate(30deg)',
        }}
      >
        <Icon sx={{ fontSize: 140, color: cardColor }} />
      </Box>

      <CardContent>
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton
              sx={{
                backgroundColor: cardColor,
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: cardColor,
                },
              }}
              size="small"
            >
              <Icon />
            </IconButton>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
          </Box>

          <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
            {value}
          </Typography>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: trend.isPositive
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs last period
              </Typography>
            </Box>
          )}

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 