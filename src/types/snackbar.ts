export type SnackbarType = 'success' | 'error' | 'warning' | 'info';
export type SnackbarPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

export interface SnackbarOption {
  message: string;
  type?: SnackbarType;
  position?: SnackbarPosition;
  duration?: number;
}

export interface StackedSnackbar {
  id: string;
  message: string;
  type: SnackbarType;
  position: SnackbarPosition;
  duration: number;
}
