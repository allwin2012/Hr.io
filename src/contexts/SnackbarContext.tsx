// contexts/SnackbarContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { CheckCircle, Error, Info } from '@mui/icons-material';

type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('info');
  const [visible, setVisible] = useState(false);

  const showSnackbar = useCallback((msg: string, type: SnackbarType = 'info') => {
    setMessage(msg);
    setType(type);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="snackbar-icon" />;
      case 'error':
        return <Error className="snackbar-icon" />;
      case 'info':
      default:
        return <Info className="snackbar-icon" />;
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {visible && (
        <div className={`snackbar snackbar-${type}`}>
          {getIcon()}
          <span>{message}</span> 
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new window.Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
