import React from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { testLogin } from '@/utils/test-login';

export const LoginTest: React.FC = () => {
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await testLogin();
      if (data) {
        setResult(data);
        // Dispatch toast event
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: { message: 'Test đăng nhập thành công!', severity: 'success' }
        }));
      } else {
        setError('Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi test đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Test Đăng Nhập
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={handleTestLogin}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Đang test...' : 'Test Đăng Nhập'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Đăng nhập thành công!</strong>
          </Typography>
          <Typography variant="body2">
            Access Token: {result.access?.substring(0, 50)}...
          </Typography>
          <Typography variant="body2">
            Refresh Token: {result.refresh?.substring(0, 50)}...
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
