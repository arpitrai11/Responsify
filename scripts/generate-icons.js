import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate a valid RGBA PNG file of width x height
function createPng(width, height) {
  // RGBA buffer: 4 bytes per pixel + 1 filter byte per row
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Coordinate from center (-1 to 1)
      const cx = (x - width / 2) / (width / 2);
      const cy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(cx * cx + cy * cy);

      // Rounded rectangle for device frame
      const inIcon = Math.abs(cx) < 0.85 && Math.abs(cy) < 0.85;
      const isBorder = (Math.abs(cx) > 0.72 || Math.abs(cy) > 0.72) && inIcon;
      const isScreen = Math.abs(cx) <= 0.72 && Math.abs(cy) <= 0.72;

      // Device viewport indicator line
      const isLine = isScreen && Math.abs(cy - 0.2) < 0.08 && Math.abs(cx) < 0.5;
      const isCamera = Math.abs(cy + 0.78) < 0.05 && Math.abs(cx) < 0.08;

      if (dist > 0.98) {
        // Transparent
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      } else if (isCamera) {
        // Camera dot
        rawData[pxOffset] = 255;
        rawData[pxOffset + 1] = 255;
        rawData[pxOffset + 2] = 255;
        rawData[pxOffset + 3] = 220;
      } else if (isLine) {
        // Cyan accent inspect bar
        rawData[pxOffset] = 56;
        rawData[pxOffset + 1] = 189;
        rawData[pxOffset + 2] = 248;
        rawData[pxOffset + 3] = 255;
      } else if (isScreen) {
        // Screen background (Deep indigo/slate)
        rawData[pxOffset] = 15;
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
        rawData[pxOffset + 3] = 245;
      } else if (inIcon) {
        // Outer chassis (Vibrant Indigo 600)
        rawData[pxOffset] = 99;
        rawData[pxOffset + 1] = 102;
        rawData[pxOffset + 2] = 241;
        rawData[pxOffset + 3] = 255;
      } else {
        // Glow / gradient rim
        rawData[pxOffset] = 79;
        rawData[pxOffset + 1] = 70;
        rawData[pxOffset + 2] = 229;
        rawData[pxOffset + 3] = 200;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, len + 8));
  chunk.writeUInt32BE(crc, len + 8);
  return chunk;
}

// CRC32 implementation for PNG
function crc32(buf) {
  let c = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = c ^ buf[n];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

[16, 32, 48, 128].forEach(size => {
  const png = createPng(size, size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Generated icon${size}.png (${png.length} bytes)`);
});
