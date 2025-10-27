import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import AppRoutes from "@/routes/AppRoutes";

const theme = createTheme({
    palette: {
        primary: {
            main: "#667eea",
        },
        secondary: {
            main: "#764ba2",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRoutes />
        </ThemeProvider>
    );
}

export default App;
