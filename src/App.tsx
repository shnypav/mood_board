import { ThemeProvider } from './contexts/ThemeContext';
import { ImageProvider } from './contexts/ImageContext';
import { ZoomProvider } from './contexts/ZoomContext';
import { AppErrorBoundary } from './AppErrorBoundary';
import { HeaderLayout } from './layouts/HeaderLayout';
import { MoodBoard } from './components/MoodBoardComponent';

const App = () => {
    return (
        <AppErrorBoundary>
            <ThemeProvider>
                <ImageProvider>
                    <ZoomProvider>
                        <HeaderLayout>
                            <MoodBoard />
                        </HeaderLayout>
                    </ZoomProvider>
                </ImageProvider>
            </ThemeProvider>
        </AppErrorBoundary>
    );
};

export default App;