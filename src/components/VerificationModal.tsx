import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  type: 'sub' | 'like';
  videoTitle: string;
  channelName: string;
  onClose: () => void;
  onVerify: (screenshotUrl: string, confirmMessage: string) => void;
  isLoading?: boolean;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  type,
  videoTitle,
  channelName,
  onClose,
  onVerify,
  isLoading = false
}) => {
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!confirmMessage.trim()) {
      setError('Please confirm your action');
      return;
    }

    if (!selectedFile) {
      setError('Please upload a screenshot as proof');
      return;
    }

    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onVerify(dataUrl, confirmMessage);
    };
    reader.readAsDataURL(selectedFile);
  };

  const actionText = type === 'sub' ? 'Subscribed to' : 'Liked';
  const actionColor = type === 'sub' ? 'emerald' : 'rose';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#141830] border border-slate-700 rounded-3xl max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {type === 'sub' ? 'Verify Subscription' : 'Verify Like'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Proof of {actionText.toLowerCase()} required to earn credits
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Video Info */}
          <div className={`p-4 rounded-2xl bg-${actionColor}-500/10 border border-${actionColor}-500/20`}>
            <p className="text-xs text-slate-400 mb-1">You are verifying:</p>
            <h4 className="font-bold text-white text-sm truncate">{videoTitle}</h4>
            <p className="text-xs text-slate-400 mt-1">Channel: {channelName}</p>
          </div>

          {/* Action Confirmation */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              I confirm I have {actionText.toLowerCase()} this video/channel:
            </label>
            <textarea
              value={confirmMessage}
              onChange={(e) => {
                setConfirmMessage(e.target.value);
                setError(null);
              }}
              placeholder={
                type === 'sub'
                  ? 'I have subscribed to this channel'
                  : 'I have liked this video'
              }
              className="w-full px-3 py-2 bg-[#0f1120] border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              rows={3}
              disabled={isLoading}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Be truthful: false claims will be rejected
            </p>
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Upload Screenshot as Proof:
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500/50 transition">
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-40 object-contain rounded-lg"
                  />
                  <p className="text-xs text-amber-400 font-semibold">
                    {selectedFile?.name}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-300"
                    disabled={isLoading}
                  >
                    Change image
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="screenshot-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Click to upload screenshot
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG (max 5MB)
                      </p>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-indigo-300">
              <p className="font-semibold">Important:</p>
              <p>
                Take a clear screenshot showing the subscription badge or like
                button. Verification helps prevent fraudulent claims.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-300">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !confirmMessage.trim() || !selectedFile}
              className={`flex-1 py-2.5 px-3 bg-gradient-to-r from-${actionColor}-600 to-${actionColor === 'emerald' ? 'teal' : 'pink'}-600 hover:from-${actionColor}-500 hover:to-${actionColor === 'emerald' ? 'teal' : 'pink'}-500 text-white rounded-xl text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit Proof
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
