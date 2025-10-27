import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: 3,
            p: 3,
          }}
        >
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Đã xảy ra lỗi
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 500 }}>
            Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
          </Typography>
          {this.state.error && (
            <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
              <Typography variant="body2" fontFamily="monospace">
                {this.state.error.message}
              </Typography>
            </Alert>
          )}
          <Button
            variant="contained"
            onClick={this.handleReload}
            sx={{ mt: 2 }}
          >
            Tải lại trang
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
