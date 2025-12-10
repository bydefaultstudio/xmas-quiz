'use client';

import { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onHide,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  if (!isVisible) return null;

  return (
    <div className={styles.toast}>
      <span className={styles.message}>{message}</span>
    </div>
  );
}

