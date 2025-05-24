import { BoardProvider } from './contexts/BoardContext';
import { ImageProvider } from './contexts/ImageContext';
import { ZoomProvider } from './contexts/ZoomContext';
import { AppErrorBoundary } from './AppErrorBoundary';
import { HeaderLayout } from './layouts/HeaderLayout';
import { MoodBoard } from './components/MoodBoardComponent';

const App = () => {
    return (
        <AppErrorBoundary>
            <BoardProvider>
                <ImageProvider>
                    <ZoomProvider>
                        <HeaderLayout>
                            <MoodBoard />
                        </HeaderLayout>
                    </ZoomProvider>
                </ImageProvider>
            </BoardProvider>
        </AppErrorBoundary>
    );
};

export default App;