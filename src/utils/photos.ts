import { SamplePhoto } from '../types';

let cachedSamples: SamplePhoto[] | null = null;

function createCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

export function generateSamples(): SamplePhoto[] {
  if (cachedSamples) return cachedSamples;

  const list: SamplePhoto[] = [];

  // 1. Cyberpunk Neon City
  {
    const { canvas, ctx: x } = createCanvas();
    const sky = x.createLinearGradient(0, 0, 0, 600);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(0.5, '#1e1b4b');
    sky.addColorStop(0.85, '#4c0519');
    sky.addColorStop(1, '#f43f5e');
    x.fillStyle = sky;
    x.fillRect(0, 0, 600, 600);

    // Glowing Neon Moon
    const moonGrad = x.createRadialGradient(480, 130, 10, 480, 130, 80);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.4, '#38bdf8');
    moonGrad.addColorStop(1, 'transparent');
    x.fillStyle = moonGrad;
    x.beginPath();
    x.arc(480, 130, 80, 0, Math.PI * 2);
    x.fill();

    x.fillStyle = '#ffffff';
    x.beginPath();
    x.arc(480, 130, 42, 0, Math.PI * 2);
    x.fill();

    // High-tech Skyscrapers
    const bldgs = [
      [15, 230, 85, '#090d16', '#38bdf8'],
      [110, 150, 95, '#0f172a', '#f43f5e'],
      [220, 290, 105, '#090d16', '#a855f7'],
      [335, 120, 90, '#0f172a', '#06b6d4'],
      [435, 210, 80, '#090d16', '#eab308'],
      [525, 270, 75, '#0f172a', '#f43f5e'],
    ];

    bldgs.forEach(([bx, by, bw, col, winCol]) => {
      x.fillStyle = col as string;
      x.fillRect(bx as number, by as number, bw as number, 600 - (by as number));

      // Bevel edge
      x.fillStyle = 'rgba(255,255,255,0.15)';
      x.fillRect(bx as number, by as number, 3, 600 - (by as number));

      // Illuminated Windows
      x.fillStyle = winCol as string;
      for (let wy = (by as number) + 16; wy < 560; wy += 32) {
        for (let wx = (bx as number) + 10; wx < (bx as number) + (bw as number) - 14; wx += 20) {
          if (Math.sin(wx * 3 + wy * 5) > -0.15) {
            x.fillRect(wx, wy, 9, 14);
          }
        }
      }
    });

    // Street level neon grid
    x.fillStyle = '#05070e';
    x.fillRect(0, 560, 600, 40);
    x.strokeStyle = '#06b6d4';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(0, 560);
    x.lineTo(600, 560);
    x.stroke();

    list.push({
      id: 'city',
      name: 'Cyberpunk Metropolis',
      category: 'Arcade',
      url: canvas.toDataURL('image/jpeg', 0.92),
    });
  }

  // 2. Sunset Peaks
  {
    const { canvas, ctx: x } = createCanvas();
    const g = x.createLinearGradient(0, 0, 0, 600);
    g.addColorStop(0, '#312e81');
    g.addColorStop(0.4, '#a21caf');
    g.addColorStop(0.7, '#f97316');
    g.addColorStop(1, '#fef08a');
    x.fillStyle = g;
    x.fillRect(0, 0, 600, 600);

    // Glowing Golden Sun
    const sunGrad = x.createRadialGradient(430, 200, 10, 430, 200, 110);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.5, '#fde047');
    sunGrad.addColorStop(1, 'transparent');
    x.fillStyle = sunGrad;
    x.beginPath();
    x.arc(430, 200, 110, 0, Math.PI * 2);
    x.fill();

    // Mountain silhouettes
    x.fillStyle = '#4a044e';
    x.beginPath();
    x.moveTo(-40, 600);
    x.lineTo(190, 220);
    x.lineTo(420, 600);
    x.fill();

    // Mountain Snowcap
    x.fillStyle = '#ffffff';
    x.beginPath();
    x.moveTo(190, 220);
    x.lineTo(140, 305);
    x.lineTo(180, 290);
    x.lineTo(210, 320);
    x.lineTo(235, 295);
    x.fill();

    // Front Mountain
    x.fillStyle = '#1e1b4b';
    x.beginPath();
    x.moveTo(150, 600);
    x.lineTo(410, 270);
    x.lineTo(650, 570);
    x.lineTo(650, 600);
    x.fill();

    // Front Snowcap
    x.fillStyle = '#fed7aa';
    x.beginPath();
    x.moveTo(410, 270);
    x.lineTo(370, 330);
    x.lineTo(405, 325);
    x.lineTo(435, 350);
    x.fill();

    // Forest tree silhouettes
    x.fillStyle = '#09090b';
    for (let i = 0; i < 15; i++) {
      x.beginPath();
      x.moveTo(i * 44 + 5, 600);
      x.lineTo(i * 44 + 22, 510);
      x.lineTo(i * 44 + 39, 600);
      x.fill();
    }

    list.push({
      id: 'mountains',
      name: 'Sunset Peaks',
      category: 'Landscape',
      url: canvas.toDataURL('image/jpeg', 0.92),
    });
  }

  // 3. Cyber Horizon / Retro Wave
  {
    const { canvas, ctx: x } = createCanvas();
    const bg = x.createLinearGradient(0, 0, 0, 420);
    bg.addColorStop(0, '#030712');
    bg.addColorStop(0.65, '#581c87');
    bg.addColorStop(1, '#db2777');
    x.fillStyle = bg;
    x.fillRect(0, 0, 600, 600);

    // Retro Sun with horizontal Venetian blind stripes
    const sunGrad = x.createLinearGradient(0, 120, 0, 380);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.5, '#f59e0b');
    sunGrad.addColorStop(1, '#e11d48');
    x.fillStyle = sunGrad;
    x.beginPath();
    x.arc(300, 250, 130, 0, Math.PI * 2);
    x.fill();

    x.fillStyle = '#030712';
    for (let y = 220; y < 380; y += 16) {
      const h = ((y - 220) / 160) * 9 + 2;
      x.fillRect(140, y, 320, h);
    }

    // Perspective wireframe grid ground
    x.fillStyle = '#090d16';
    x.fillRect(0, 400, 600, 200);

    x.strokeStyle = '#06b6d4';
    x.lineWidth = 2.5;
    for (let y = 410; y <= 600; y += 28) {
      x.beginPath();
      x.moveTo(0, y);
      x.lineTo(600, y);
      x.stroke();
    }
    for (let vx = -220; vx <= 820; vx += 75) {
      x.beginPath();
      x.moveTo(300, 400);
      x.lineTo(vx, 600);
      x.stroke();
    }

    list.push({
      id: 'retrowave',
      name: 'Synthwave Horizon',
      category: 'Retro Arcade',
      url: canvas.toDataURL('image/jpeg', 0.92),
    });
  }

  // 4. Midnight Ocean Lagoon
  {
    const { canvas, ctx: x } = createCanvas();
    x.fillStyle = '#020617';
    x.fillRect(0, 0, 600, 600);

    // Glowing Moon
    x.fillStyle = '#fde047';
    x.beginPath();
    x.arc(460, 120, 58, 0, Math.PI * 2);
    x.fill();

    // Ocean Waves
    const colors = ['#082f49', '#0369a1', '#0284c7', '#06b6d4', '#22d3ee', '#38bdf8'];
    colors.forEach((col, idx) => {
      x.fillStyle = col;
      x.beginPath();
      x.moveTo(0, 600);
      const baseY = 240 + idx * 58;
      for (let i = 0; i <= 600; i += 10) {
        const waveY = baseY + Math.sin(i / 45 + idx * 1.3) * 28;
        x.lineTo(i, waveY);
      }
      x.lineTo(600, 600);
      x.fill();
    });

    list.push({
      id: 'waves',
      name: 'Midnight Lagoon',
      category: 'Artistic',
      url: canvas.toDataURL('image/jpeg', 0.92),
    });
  }

  // 5. Golden Bullseye
  {
    const { canvas, ctx: x } = createCanvas();
    x.fillStyle = '#0b0f19';
    x.fillRect(0, 0, 600, 600);

    for (let r = 300, k = 0; r > 15; r -= 32, k++) {
      x.fillStyle = k % 2 === 0 ? '#f59e0b' : '#1e293b';
      x.beginPath();
      x.arc(300, 300, r, 0, Math.PI * 2);
      x.fill();
    }

    x.strokeStyle = '#38bdf8';
    x.lineWidth = 5;
    x.beginPath();
    x.moveTo(300, 0);
    x.lineTo(300, 600);
    x.moveTo(0, 300);
    x.lineTo(600, 300);
    x.stroke();

    x.fillStyle = '#ffffff';
    x.font = 'bold 54px monospace';
    x.fillText('A', 35, 80);
    x.fillText('B', 530, 80);
    x.fillText('C', 35, 570);
    x.fillText('D', 530, 570);

    list.push({
      id: 'target',
      name: 'Golden Target',
      category: 'Geometric',
      url: canvas.toDataURL('image/jpeg', 0.92),
    });
  }

  // 6. Typography Block
  {
    const { canvas, ctx: x } = createCanvas();
    x.fillStyle = '#f43f5e';
    x.fillRect(0, 0, 600, 300);
    x.fillStyle = '#0f172a';
    x.fillRect(0, 300, 600, 300);

    x.font = '900 180px sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';

    x.fillStyle = '#ffffff';
    x.fillText('PUZ', 300, 160);

    x.fillStyle = '#38bdf8';
    x.fillText('ZLE', 300, 440);

    x.fillStyle = '#fde047';
    x.beginPath();
    x.arc(520, 80, 30, 0, Math.PI * 2);
    x.fill();

    list.push({
      id: 'letters',
      name: 'Pop Art Type',
      category: 'Graphic',
      url: canvas.toDataURL('image/jpeg', 0.92),
    });
  }

  cachedSamples = list;
  return list;
}

export function fileToSquare(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image'));
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = 720;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 720, 720);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
