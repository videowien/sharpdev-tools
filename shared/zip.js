/* SharpDev — Minimal store-only ZIP writer
 * Usage: const blob = SDZip.create([{ name: 'file.png', data: Uint8Array }, ...]);
 * Produces a valid .zip with STORE method (no compression).
 */
(function () {
  // ---- CRC32 (table-based) ----
  const CRC_TABLE = (function () {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function strToBytes(s) {
    return new TextEncoder().encode(s);
  }

  // DOS time/date from now
  function dosTimeDate(d) {
    d = d || new Date();
    const time = ((d.getHours() & 0x1f) << 11) |
                 ((d.getMinutes() & 0x3f) << 5) |
                 ((Math.floor(d.getSeconds() / 2)) & 0x1f);
    const date = (((d.getFullYear() - 1980) & 0x7f) << 9) |
                 (((d.getMonth() + 1) & 0xf) << 5) |
                 (d.getDate() & 0x1f);
    return { time, date };
  }

  function writeU16(view, offset, val) {
    view.setUint16(offset, val, true);
  }
  function writeU32(view, offset, val) {
    view.setUint32(offset, val >>> 0, true);
  }

  function create(files) {
    // files: [{ name: string, data: Uint8Array }]
    const { time, date } = dosTimeDate();

    // Pre-compute name bytes & crc per entry
    const entries = files.map(f => {
      const data = f.data instanceof Uint8Array ? f.data : new Uint8Array(f.data);
      const nameBytes = strToBytes(f.name);
      return {
        nameBytes,
        data,
        crc: crc32(data),
        size: data.length,
      };
    });

    // Sizes
    const LFH_SIZE = 30;
    const CDFH_SIZE = 46;
    const EOCD_SIZE = 22;

    let localTotal = 0;
    for (const e of entries) localTotal += LFH_SIZE + e.nameBytes.length + e.size;

    let centralTotal = 0;
    for (const e of entries) centralTotal += CDFH_SIZE + e.nameBytes.length;

    const total = localTotal + centralTotal + EOCD_SIZE;
    const buf = new Uint8Array(total);
    const view = new DataView(buf.buffer);

    let offset = 0;
    const offsets = [];

    // Local file headers + data
    for (const e of entries) {
      offsets.push(offset);
      writeU32(view, offset, 0x04034b50);        // signature
      writeU16(view, offset + 4, 20);            // version needed
      writeU16(view, offset + 6, 0);             // flags
      writeU16(view, offset + 8, 0);             // method = store
      writeU16(view, offset + 10, time);
      writeU16(view, offset + 12, date);
      writeU32(view, offset + 14, e.crc);
      writeU32(view, offset + 18, e.size);       // compressed size = uncompressed (store)
      writeU32(view, offset + 22, e.size);
      writeU16(view, offset + 26, e.nameBytes.length);
      writeU16(view, offset + 28, 0);            // extra length
      offset += LFH_SIZE;
      buf.set(e.nameBytes, offset); offset += e.nameBytes.length;
      buf.set(e.data, offset); offset += e.size;
    }

    const centralStart = offset;

    // Central directory
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      writeU32(view, offset, 0x02014b50);        // CDFH signature
      writeU16(view, offset + 4, 20);            // version made by
      writeU16(view, offset + 6, 20);            // version needed
      writeU16(view, offset + 8, 0);             // flags
      writeU16(view, offset + 10, 0);            // method = store
      writeU16(view, offset + 12, time);
      writeU16(view, offset + 14, date);
      writeU32(view, offset + 16, e.crc);
      writeU32(view, offset + 20, e.size);
      writeU32(view, offset + 24, e.size);
      writeU16(view, offset + 28, e.nameBytes.length);
      writeU16(view, offset + 30, 0);            // extra
      writeU16(view, offset + 32, 0);            // comment
      writeU16(view, offset + 34, 0);            // disk
      writeU16(view, offset + 36, 0);            // internal attrs
      writeU32(view, offset + 38, 0);            // external attrs
      writeU32(view, offset + 42, offsets[i]);   // local header offset
      offset += CDFH_SIZE;
      buf.set(e.nameBytes, offset); offset += e.nameBytes.length;
    }

    // EOCD
    writeU32(view, offset, 0x06054b50);
    writeU16(view, offset + 4, 0);               // disk
    writeU16(view, offset + 6, 0);               // disk w/ CD
    writeU16(view, offset + 8, entries.length);
    writeU16(view, offset + 10, entries.length);
    writeU32(view, offset + 12, centralTotal);
    writeU32(view, offset + 16, centralStart);
    writeU16(view, offset + 20, 0);              // comment length

    return new Blob([buf], { type: 'application/zip' });
  }

  window.SDZip = { create, crc32 };
})();
