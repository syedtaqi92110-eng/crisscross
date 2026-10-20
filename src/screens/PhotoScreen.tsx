import React, { useRef } from 'react';
import { ChevronLeft, Upload, Sparkles } from 'lucide-react';
import { SamplePhoto } from '../types';
import { fileToSquare, generateSamples } from '../utils/photos';

interface PhotoScreenProps {
  N: number;
  onSelectImage: (imgUrl: string) => void;
  onBack: () => void;
}

export const PhotoScreen: React.FC<PhotoScreenProps> = ({
  N,
  onSelectImage,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const samples: SamplePhoto[] = React.useMemo(() => generateSamples(), []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const croppedUrl = await fileToSquare(file);
      onSelectImage(croppedUrl);
    } catch (err) {
      console.error('Failed to crop photo', err);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none max-w-md mx-auto">
      <div>
        {/* Topbar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-white">Choose a Photo</h2>
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full shadow-inner">
            {N * N} pieces
          </span>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Upload Custom Photo Button */}
        <div className="mt-5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black flex items-center justify-center gap-3.5 shadow-[0_6px_25px_rgba(245,158,11,0.35)] active:scale-98 transition-all"
          >
            <Upload className="w-5 h-5 stroke-[2.8]" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-black">Choose from Gallery</span>
              <span className="text-[11px] font-semibold opacity-90">
                Upload your own photo from device
              </span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-slate-400 text-xs font-semibold">
          <div className="h-px bg-white/10 flex-1" />
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            or select a premium preset
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Samples Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[48vh] overflow-y-auto pr-1">
          {samples.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectImage(sample.url)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-amber-400/70 active:scale-95 transition-all text-left group shadow-md"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="w-full px-1">
                <span className="text-xs font-bold text-white block truncate">
                  {sample.name}
                </span>
                <span className="text-[10px] text-amber-400/90 block truncate font-medium">
                  {sample.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-3 font-medium">
        Photos are processed entirely on your device and never uploaded.
      </p>
    </div>
  );
};
