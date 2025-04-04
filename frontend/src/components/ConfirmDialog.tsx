import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaExclamationTriangle className="w-10 h-10 text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="w-10 h-10 text-amber-500" />;
      case 'success':
        return <FaCheck className="w-10 h-10 text-green-500" />;
      case 'info':
      default:
        return <FaExclamationTriangle className="w-10 h-10 text-blue-500" />;
    }
  };

  // Button style based on type
  const getButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  };

  // Prevent propagation of click events inside the modal content
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div 
        className="p-6 bg-white rounded-lg shadow-lg" 
        onClick={handleContentClick}
      >
        <div className="flex flex-col items-center mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold mt-4 text-center">{title}</h3>
        </div>
        
        <div className="mb-6 text-center">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            <FaTimes className="mr-2" /> {cancelText}
          </Button>
          
          <Button
            variant={getButtonVariant() as any}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            <FaCheck className="mr-2" /> {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;