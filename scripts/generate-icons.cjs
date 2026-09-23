const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Function to generate pure PNG from raw RGBA buffer
function createPNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.concat([typeBuf, data]);
    const crc = zlib.crc32(crcBuf);
    const crcOut = Buffer.alloc(4);
    crcOut.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcOut]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const scanlines = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (width * 4 + 1);
    scanlines[scanlineOffset] = 0;
    const rawOffset = y * width * 4;
    rgbaBuffer.copy(scanlines, scanlineOffset + 1, rawOffset, rawOffset + width * 4);
  }

  const idatData = zlib.deflateSync(scanlines);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Render icon at size N with elegant medical-tech styling
function drawSidoraIcon(size, isMaskable = false) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      const hw = isMaskable ? size * 0.5 : size * 0.44;
      const hh = isMaskable ? size * 0.5 : size * 0.44;
      const cr = isMaskable ? 0 : size * 0.20;

      let inside = false;
      if (dx <= hw && dy <= hh) {
        if (dx <= hw - cr || dy <= hh - cr) {
          inside = true;
        } else {
          const cdx = dx - (hw - cr);
          const cdy = dy - (hh - cr);
          if (cdx * cdx + cdy * cdy <= cr * cr) {
            inside = true;
          }
        }
      }

      if (inside) {
        // Gradient from Emerald #059669 to Teal #0d9488
        const gradT = (x * 0.6 + y * 0.4) / size;
        const rVal = Math.round(5 + (13 - 5) * gradT);
        const gVal = Math.round(150 + (148 - 150) * gradT);
        const bVal = Math.round(105 + (136 - 105) * gradT);

        const cdx = x - cx;
        const cdy = y - cy;
        const distFromCenter = Math.sqrt(cdx * cdx + cdy * cdy);

        // Medical Cross + Message Bell Symbol
        const scale = isMaskable ? 0.75 : 1.0;
        const inCrossV = Math.abs(cdx) <= size * 0.055 * scale && Math.abs(cdy) <= size * 0.20 * scale;
        const inCrossH = Math.abs(cdy) <= size * 0.055 * scale && Math.abs(cdx) <= size * 0.20 * scale;
        const inRing = (distFromCenter >= size * 0.28 * scale && distFromCenter <= size * 0.31 * scale);

        if (inCrossV || inCrossH) {
          buf[idx] = 255;
          buf[idx + 1] = 255;
          buf[idx + 2] = 255;
          buf[idx + 3] = 255;
        } else if (inRing) {
          buf[idx] = 255;
          buf[idx + 1] = 255;
          buf[idx + 2] = 255;
          buf[idx + 3] = 180;
        } else {
          buf[idx] = rVal;
          buf[idx + 1] = gVal;
          buf[idx + 2] = bVal;
          buf[idx + 3] = 255;
        }
      } else {
        buf[idx] = 0;
        buf[idx + 1] = 0;
        buf[idx + 2] = 0;
        buf[idx + 3] = 0;
      }
    }
  }

  return createPNG(size, size, buf);
}

fs.writeFileSync('public/icons/icon-192.png', drawSidoraIcon(192));
fs.writeFileSync('public/icons/icon-512.png', drawSidoraIcon(512));
fs.writeFileSync('public/icons/icon-maskable.png', drawSidoraIcon(512, true));
fs.writeFileSync('public/icons/apple-touch-icon.png', drawSidoraIcon(180));
console.log('PNG Icons generated successfully!');
