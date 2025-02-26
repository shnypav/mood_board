import { ThemeProvider } from './contexts/ThemeContext';
import { ImageProvider } from './contexts/ImageContext';
import { AppErrorBoundary } from './AppErrorBoundary';
import { HeaderLayout } from './layouts/HeaderLayout';
import { MoodBoard } from './components/MoodBoardComponent';

const App = () => {
    return (
        <AppErrorBoundary>
            <ThemeProvider>
                <ImageProvider>
                    <HeaderLayout>
                        <MoodBoard />
                    </HeaderLayout>
                </ImageProvider>
            </ThemeProvider>
        </AppErrorBoundary>
    );
};

export default App;
