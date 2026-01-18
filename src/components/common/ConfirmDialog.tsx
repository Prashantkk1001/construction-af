const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
}: any) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p>{message}</p>
      <div className="mt-4 flex gap-3">
        <button onClick={onConfirm} className="bg-red-500 text-white px-3 py-1">
          Yes
        </button>
        <button onClick={onCancel} className="bg-gray-300 px-3 py-1">
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
