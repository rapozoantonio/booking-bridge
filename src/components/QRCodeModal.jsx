import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, placeId, placeName }) => {
  const qrRef = useRef(null);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/p/${placeId}`;

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1000;
    canvas.height = 1200;

    img.onload = () => {
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 100, 100, 800, 800);

      // Add text below
      ctx.fillStyle = 'black';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(placeName, canvas.width / 2, 1000);

      ctx.font = '32px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText('Scan to view our link hub', canvas.width / 2, 1100);

      // Download
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${placeName.replace(/\s+/g, '-')}-QR-Code.png`;
      link.href = url;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Place</h2>
          <p className="text-gray-600">Scan or share this QR code with your guests</p>
        </div>

        {/* QR Code */}
        <div ref={qrRef} className="flex justify-center p-8 bg-white rounded-xl border-2 border-gray-200 mb-6">
          <QRCodeSVG
            value={publicUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Place Name */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{placeName}</h3>
          <p className="text-sm text-gray-500 mt-1 break-all">{publicUrl}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Download QR Code
          </button>

          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Copy Link
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-900 font-medium mb-2">💡 How to use:</p>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Print on table tents or menus</li>
            <li>• Add to receipts or business cards</li>
            <li>• Display at your entrance</li>
            <li>• Share on social media</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QRCodeModal;
