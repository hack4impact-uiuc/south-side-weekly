import toast from 'react-hot-toast';

const triggerSuccessToast = (message: string): void => {
  toast.success(message, {
    position: 'bottom-center',
  });
};

export { triggerSuccessToast };
