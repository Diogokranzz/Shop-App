import { useState } from "react";

interface PixelImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PixelImage({ src, alt, className = "" }: PixelImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageError ? (
        // Placeholder pixel art quando erro
        <div className="w-full h-full bg-[#C0C0C0] flex flex-col items-center justify-center p-4 relative">
          {/* Padrão dithering de fundo */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 4px, #000 4px, #000 5px)",
            }}
          />
          {/* Conteúdo do placeholder */}
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-2 border-2 border-black bg-white flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p className="text-[10px] font-bold">IMAGEM</p>
            <p className="text-[10px] font-bold">INDISPONÍVEL</p>
          </div>
        </div>
      ) : (
        <>
          {/* Imagem COLORIDA - foto real do produto */}
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            style={{
              imageRendering: "auto",
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </>
      )}
    </div>
  );
}
