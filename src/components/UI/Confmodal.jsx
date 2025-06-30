import { useEffect, useState } from "react";

export default function Confmodal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [Icon, setIcon] = useState(null); 

  useEffect(() => {
    const showModal = (e) => {
      const { title, onConfirm, onCancel, Icon } = e.detail;
      setTitle(title || '');
      setOnConfirm(() => onConfirm || (() => {}));
      setOnCancel(() => onCancel || (() => {}));
      setIcon(() => Icon || null);
      setOpen(true);
    };

    window.addEventListener('showConf', showModal);
    return () => {
      window.removeEventListener('showConf', showModal);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        {Icon && <Icon className="mx-auto text-red-600 w-10 h-10 mb-4" />}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
