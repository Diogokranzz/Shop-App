import { useEffect, useRef } from "react";

interface AtkinsonDitheringProps {
  src: string;
  alt: string;
  className?: string;
  threshold?: number;
}

export function AtkinsonDithering({
  src,
  alt,
  className = "",
  threshold = 128,
}: AtkinsonDitheringProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    
    // Não usar crossOrigin para evitar problemas CORS
    // Em vez disso, vamos criar um padrão dithering simulado

    img.onload = () => {
      try {
        // Define tamanho do canvas
        canvas.width = img.width;
        canvas.height = img.height;

        // Desenha imagem original
        ctx.drawImage(img, 0, 0);

        // Tenta obter dados dos pixels
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Aplica dithering Atkinson
          applyAtkinson(data, canvas.width, canvas.height, threshold);

          // Renderiza resultado
          ctx.putImageData(imageData, 0, 0);
        } catch (e) {
          // Se falhar devido ao CORS, aplicar efeito visual alternativo
          console.warn("CORS bloqueou acesso aos pixels, usando efeito alternativo");
          applyAlternativeDithering(ctx, canvas.width, canvas.height);
        }
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    };

    img.onerror = () => {
      console.error("Erro ao carregar imagem:", src);
      // Desenhar placeholder
      drawPlaceholder(ctx, canvas);
    };

    img.src = src;
  }, [src, threshold]);

  return (
    <canvas
      ref={canvasRef}
      className={`pixel-perfect ${className}`}
      aria-label={alt}
    />
  );
}

function applyAtkinson(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
) {
  // Converter para escala de cinza primeiro
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  // Aplicar dithering Atkinson
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const oldPixel = data[index];
      const newPixel = oldPixel < threshold ? 0 : 255;
      const error = (oldPixel - newPixel) / 8; // Atkinson divide por 8

      data[index] = data[index + 1] = data[index + 2] = newPixel;

      // Distribuir erro segundo matriz Atkinson
      // Padrão:     *  1  1
      //             1  1  1
      //                1
      distributeError(data, width, height, x + 1, y, error);
      distributeError(data, width, height, x + 2, y, error);
      distributeError(data, width, height, x - 1, y + 1, error);
      distributeError(data, width, height, x, y + 1, error);
      distributeError(data, width, height, x + 1, y + 1, error);
      distributeError(data, width, height, x, y + 2, error);
    }
  }
}

function distributeError(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  error: number
) {
  if (x >= 0 && x < width && y >= 0 && y < height) {
    const index = (y * width + x) * 4;
    data[index] = data[index + 1] = data[index + 2] = data[index] + error;
  }
}

// Efeito alternativo quando CORS bloqueia acesso aos pixels
function applyAlternativeDithering(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // Aplica filtro de contraste e padrão dithering por cima
  ctx.filter = "grayscale(100%) contrast(150%)";
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.filter = "none";

  // Adiciona padrão de dithering visual
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = ctx.createPattern(createDitherPattern(), "repeat") || "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
}

// Cria padrão de dithering 4x4 (Bayer matrix)
function createDitherPattern() {
  const size = 4;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = bayerMatrix[y][x] / 16;
      const alpha = value * 0.3; // Reduz intensidade
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return canvas;
}

// Desenha placeholder quando imagem falha
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  canvas.width = 400;
  canvas.height = 300;

  // Fundo cinza
  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Borda
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Padrão dithering
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  // Texto
  ctx.fillStyle = "#000000";
  ctx.font = "20px 'VT323', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PRODUTO", canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillText("IMAGEM", canvas.width / 2, canvas.height / 2 + 10);
}
