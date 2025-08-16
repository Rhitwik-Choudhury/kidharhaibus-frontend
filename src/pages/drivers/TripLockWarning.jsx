import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Fixed, high-visibility banner reminding drivers
 * not to close the tab or lock the phone during a live trip.
 *
 * Props:
 *  - visible: boolean (show/hide)
 */
const TripLockWarning = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[1000]">
      <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 px-4 py-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>

          <div className="flex-1">
            {/* English */}
            <p className="font-semibold text-yellow-900">
              Don’t close this tab or lock your phone.
            </p>
            <p className="text-sm text-yellow-800">
              Keeping this screen open ensures live tracking continues.
            </p>

            {/* Hindi */}
            <p className="font-semibold text-yellow-900 mt-2">
              कृपया इस टैब को बंद न करें और फोन लॉक न करें।
            </p>
            <p className="text-sm text-yellow-800">
              स्क्रीन खुली रखने से लाइव ट्रैकिंग जारी रहती है।
            </p>

            {/* Assamese */}
            <p className="font-semibold text-yellow-900 mt-2">
              অনুগ্ৰহ কৰি এই টেব বন্ধ নকৰিব বা আপোনাৰ ফোন লক নকৰিব।
            </p>
            <p className="text-sm text-yellow-800">
              এই স্ক্ৰিন খোলা ৰাখিলে লাইভ ট্ৰেকিং চলি থাকে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripLockWarning;
