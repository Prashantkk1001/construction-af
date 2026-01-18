const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-5 rounded w-96">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 px-4 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
