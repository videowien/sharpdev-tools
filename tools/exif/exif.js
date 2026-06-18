// EXIF / Image Metadata Viewer
(function () {
  'use strict';

  const TAGS = {
    // IFD0 / Image
    0x0100: 'ImageWidth', 0x0101: 'ImageLength', 0x0102: 'BitsPerSample',
    0x0103: 'Compression', 0x0106: 'PhotometricInterpretation',
    0x010E: 'ImageDescription', 0x010F: 'Make', 0x0110: 'Model',
    0x0112: 'Orientation', 0x011A: 'XResolution', 0x011B: 'YResolution',
    0x0128: 'ResolutionUnit', 0x0131: 'Software', 0x0132: 'DateTime',
    0x013B: 'Artist', 0x013E: 'WhitePoint', 0x013F: 'PrimaryChromaticities',
    0x0211: 'YCbCrCoefficients', 0x0213: 'YCbCrPositioning',
    0x0214: 'ReferenceBlackWhite', 0x8298: 'Copyright',
    0x8769: 'ExifIFDPointer', 0x8825: 'GPSIFDPointer',
    // Exif IFD
    0x829A: 'ExposureTime', 0x829D: 'FNumber', 0x8822: 'ExposureProgram',
    0x8824: 'SpectralSensitivity', 0x8827: 'ISOSpeedRatings', 0x8828: 'OECF',
    0x9000: 'ExifVersion', 0x9003: 'DateTimeOriginal', 0x9004: 'DateTimeDigitized',
    0x9101: 'ComponentsConfiguration', 0x9102: 'CompressedBitsPerPixel',
    0x9201: 'ShutterSpeedValue', 0x9202: 'ApertureValue', 0x9203: 'BrightnessValue',
    0x9204: 'ExposureBiasValue', 0x9205: 'MaxApertureValue', 0x9206: 'SubjectDistance',
    0x9207: 'MeteringMode', 0x9208: 'LightSource', 0x9209: 'Flash',
    0x920A: 'FocalLength', 0x9214: 'SubjectArea', 0x927C: 'MakerNote',
    0x9286: 'UserComment', 0x9290: 'SubSecTime', 0x9291: 'SubSecTimeOriginal',
    0x9292: 'SubSecTimeDigitized', 0xA000: 'FlashpixVersion', 0xA001: 'ColorSpace',
    0xA002: 'PixelXDimension', 0xA003: 'PixelYDimension',
    0xA004: 'RelatedSoundFile', 0xA20E: 'FocalPlaneXResolution',
    0xA20F: 'FocalPlaneYResolution', 0xA210: 'FocalPlaneResolutionUnit',
    0xA214: 'SubjectLocation', 0xA215: 'ExposureIndex', 0xA217: 'SensingMethod',
    0xA300: 'FileSource', 0xA301: 'SceneType', 0xA302: 'CFAPattern',
    0xA401: 'CustomRendered', 0xA402: 'ExposureMode', 0xA403: 'WhiteBalance',
    0xA404: 'DigitalZoomRatio', 0xA405: 'FocalLengthIn35mmFilm',
    0xA406: 'SceneCaptureType', 0xA407: 'GainControl', 0xA408: 'Contrast',
    0xA409: 'Saturation', 0xA40A: 'Sharpness', 0xA40B: 'DeviceSettingDescription',
    0xA40C: 'SubjectDistanceRange', 0xA420: 'ImageUniqueID',
    0xA430: 'CameraOwnerName', 0xA431: 'BodySerialNumber',
    0xA432: 'LensSpecification', 0xA433: 'LensMake', 0xA434: 'LensModel',
    0xA435: 'LensSerialNumber',
    // GPS IFD
    0x0000: 'GPSVersionID', 0x0001: 'GPSLatitudeRef', 0x0002: 'GPSLatitude',
    0x0003: 'GPSLongitudeRef', 0x0004: 'GPSLongitude', 0x0005: 'GPSAltitudeRef',
    0x0006: 'GPSAltitude', 0x0007: 'GPSTimeStamp', 0x0008: 'GPSSatellites',
    0x0009: 'GPSStatus', 0x000A: 'GPSMeasureMode', 0x000B: 'GPSDOP',
    0x000C: 'GPSSpeedRef', 0x000D: 'GPSSpeed', 0x000E: 'GPSTrackRef',
    0x000F: 'GPSTrack', 0x0010: 'GPSImgDirectionRef', 0x0011: 'GPSImgDirection',
    0x0012: 'GPSMapDatum', 0x0013: 'GPSDestLatitudeRef', 0x0014: 'GPSDestLatitude',
    0x0015: 'GPSDestLongitudeRef', 0x0016: 'GPSDestLongitude',
    0x0017: 'GPSDestBearingRef', 0x0018: 'GPSDestBearing',
    0x0019: 'GPSDestDistanceRef', 0x001A: 'GPSDestDistance',
    0x001D: 'GPSDateStamp'
  };

  /* ========== EXIF parsing ========== */
  function parseEXIF(buf) {
    const view = new DataView(buf);
    // Check JPEG
    if (view.getUint16(0) !== 0xFFD8) {
      // try PNG
      if (view.getUint32(0) === 0x89504E47) return parsePNG(buf);
      return null;
    }
    let offset = 2;
    while (offset < view.byteLength) {
      const marker = view.getUint16(offset); offset += 2;
      if (marker === 0xFFE1) {
        const size = view.getUint16(offset); offset += 2;
        // Check "Exif\0\0"
        const header = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
        if (header === 'Exif') {
          return parseTIFF(buf, offset + 6, size - 8);
        }
        offset += size - 2;
      } else if ((marker & 0xFF00) === 0xFF00) {
        if (marker === 0xFFDA) break; // start of scan
        const size = view.getUint16(offset); offset += 2;
        offset += size - 2;
      } else break;
    }
    return null;
  }

  function parseTIFF(buf, start, length) {
    const view = new DataView(buf, start, length);
    const b0 = view.getUint8(0), b1 = view.getUint8(1);
    const little = (b0 === 0x49 && b1 === 0x49);
    const magic = view.getUint16(2, little);
    if (magic !== 42) return null;
    const ifd0Offset = view.getUint32(4, little);
    const tags = {};
    const ifd0 = readIFD(view, ifd0Offset, little);
    Object.assign(tags, ifd0.entries);

    if (ifd0.entries.ExifIFDPointer) {
      const exifIfd = readIFD(view, ifd0.entries.ExifIFDPointer, little);
      Object.assign(tags, exifIfd.entries);
    }
    if (ifd0.entries.GPSIFDPointer) {
      const gpsIfd = readIFD(view, ifd0.entries.GPSIFDPointer, little, true);
      for (const k of Object.keys(gpsIfd.entries)) tags[k] = gpsIfd.entries[k];
    }
    return tags;
  }

  function readIFD(view, offset, little, isGPS) {
    const entries = {};
    if (offset + 2 > view.byteLength) return { entries };
    const count = view.getUint16(offset, little);
    for (let i = 0; i < count; i++) {
      const entryOffset = offset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;
      const tag = view.getUint16(entryOffset, little);
      const type = view.getUint16(entryOffset + 2, little);
      const num = view.getUint32(entryOffset + 4, little);
      const valueOffset = entryOffset + 8;
      const value = readValue(view, type, num, valueOffset, little);
      const name = TAGS[tag] || ('Tag_' + tag.toString(16));
      entries[name] = value;
    }
    return { entries };
  }

  function readValue(view, type, count, valueOffset, little) {
    const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 0;
    const total = typeSize * count;
    let dataOffset = valueOffset;
    if (total > 4) dataOffset = view.getUint32(valueOffset, little);
    try {
      if (type === 1 || type === 7) {
        // BYTE / UNDEFINED
        const arr = new Uint8Array(count);
        for (let i = 0; i < count; i++) arr[i] = view.getUint8(dataOffset + i);
        // Try to interpret some as ASCII
        if (count <= 32 && arr.every(b => b >= 32 && b < 127)) return String.fromCharCode.apply(null, arr);
        return Array.from(arr);
      }
      if (type === 2) {
        // ASCII
        let s = '';
        for (let i = 0; i < count; i++) {
          const c = view.getUint8(dataOffset + i);
          if (c === 0) break;
          s += String.fromCharCode(c);
        }
        return s;
      }
      if (type === 3) {
        // SHORT
        if (count === 1) return view.getUint16(dataOffset, little);
        const arr = []; for (let i = 0; i < count; i++) arr.push(view.getUint16(dataOffset + i * 2, little));
        return arr;
      }
      if (type === 4) {
        // LONG
        if (count === 1) return view.getUint32(dataOffset, little);
        const arr = []; for (let i = 0; i < count; i++) arr.push(view.getUint32(dataOffset + i * 4, little));
        return arr;
      }
      if (type === 5) {
        // RATIONAL (unsigned)
        if (count === 1) {
          const n = view.getUint32(dataOffset, little);
          const d = view.getUint32(dataOffset + 4, little);
          return d === 0 ? 0 : n / d;
        }
        const arr = [];
        for (let i = 0; i < count; i++) {
          const n = view.getUint32(dataOffset + i * 8, little);
          const d = view.getUint32(dataOffset + i * 8 + 4, little);
          arr.push(d === 0 ? 0 : n / d);
        }
        return arr;
      }
      if (type === 9) {
        if (count === 1) return view.getInt32(dataOffset, little);
        const arr = []; for (let i = 0; i < count; i++) arr.push(view.getInt32(dataOffset + i * 4, little));
        return arr;
      }
      if (type === 10) {
        if (count === 1) {
          const n = view.getInt32(dataOffset, little);
          const d = view.getInt32(dataOffset + 4, little);
          return d === 0 ? 0 : n / d;
        }
        const arr = [];
        for (let i = 0; i < count; i++) {
          const n = view.getInt32(dataOffset + i * 8, little);
          const d = view.getInt32(dataOffset + i * 8 + 4, little);
          arr.push(d === 0 ? 0 : n / d);
        }
        return arr;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function parsePNG(buf) {
    const view = new DataView(buf);
    const tags = {};
    let offset = 8;
    while (offset < view.byteLength - 8) {
      const length = view.getUint32(offset); offset += 4;
      const type = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
      offset += 4;
      if (type === 'IHDR') {
        tags.ImageWidth = view.getUint32(offset);
        tags.ImageLength = view.getUint32(offset + 4);
        tags.BitDepth = view.getUint8(offset + 8);
      } else if (type === 'tEXt') {
        const bytes = new Uint8Array(buf, offset, length);
        let nullIdx = 0; while (nullIdx < bytes.length && bytes[nullIdx] !== 0) nullIdx++;
        const key = String.fromCharCode.apply(null, bytes.slice(0, nullIdx));
        const val = String.fromCharCode.apply(null, bytes.slice(nullIdx + 1));
        tags[key] = val;
      } else if (type === 'IEND') break;
      offset += length + 4;
    }
    return Object.keys(tags).length ? tags : null;
  }

  /* ========== Formatting ========== */
  function formatTagValue(key, val) {
    if (val === null || val === undefined) return '';
    if (Array.isArray(val)) {
      if (key === 'GPSLatitude' || key === 'GPSLongitude') return val.map(v => v.toFixed(6)).join(', ');
      return val.join(', ');
    }
    if (key === 'ExposureTime' && typeof val === 'number') {
      if (val < 1) return '1/' + Math.round(1 / val) + ' s';
      return val + ' s';
    }
    if (key === 'FNumber' && typeof val === 'number') return 'f/' + val.toFixed(1);
    if (key === 'FocalLength' && typeof val === 'number') return val + ' mm';
    if (key === 'Orientation') {
      const o = { 1: 'Normal', 2: 'Flipped horizontal', 3: 'Rotated 180°', 4: 'Flipped vertical', 5: 'Transposed', 6: 'Rotated 90° CW', 7: 'Transverse', 8: 'Rotated 90° CCW' };
      return o[val] || val;
    }
    if (key === 'Flash') return val === 0 ? 'No flash' : 'Flash fired';
    if (key === 'ColorSpace') return val === 1 ? 'sRGB' : (val === 65535 ? 'Uncalibrated' : val);
    if (key === 'ExposureProgram') {
      const e = { 0: 'Not defined', 1: 'Manual', 2: 'Normal program', 3: 'Aperture priority', 4: 'Shutter priority', 5: 'Creative', 6: 'Action', 7: 'Portrait', 8: 'Landscape' };
      return e[val] || val;
    }
    if (key === 'MeteringMode') {
      const m = { 0: 'Unknown', 1: 'Average', 2: 'Center-weighted', 3: 'Spot', 4: 'Multi-spot', 5: 'Pattern', 6: 'Partial' };
      return m[val] || val;
    }
    if (key === 'WhiteBalance') return val === 0 ? 'Auto' : (val === 1 ? 'Manual' : val);
    if (typeof val === 'number') return Number.isInteger(val) ? String(val) : val.toFixed(4).replace(/\.?0+$/, '');
    return String(val);
  }

  function gpsToDecimal(arr, ref) {
    if (!Array.isArray(arr) || arr.length < 3) return null;
    const [d, m, s] = arr;
    let dec = d + m / 60 + s / 3600;
    if (ref === 'S' || ref === 'W') dec = -dec;
    return dec;
  }

  function toDMS(dec, isLat) {
    const hemi = isLat ? (dec >= 0 ? 'N' : 'S') : (dec >= 0 ? 'E' : 'W');
    const abs = Math.abs(dec);
    const d = Math.floor(abs);
    const mFloat = (abs - d) * 60;
    const m = Math.floor(mFloat);
    const s = (mFloat - m) * 60;
    return `${d}° ${m}' ${s.toFixed(2)}" ${hemi}`;
  }

  /* ========== UI ========== */
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const resultEl = document.getElementById('result');
  const previewEl = document.getElementById('preview');
  const fileInfoEl = document.getElementById('file-info');
  const sectionsEl = document.getElementById('sections');
  const rawEl = document.getElementById('raw');
  const rawWrap = document.getElementById('raw-wrap');
  let currentFile = null;
  let currentTags = null;

  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault(); uploadArea.classList.remove('drag');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-strip').addEventListener('click', stripAndDownload);
  document.getElementById('btn-raw').addEventListener('click', () => {
    rawWrap.style.display = rawWrap.style.display === 'none' ? 'block' : 'none';
  });

  function reset() {
    resultEl.style.display = 'none';
    uploadArea.style.display = 'block';
    fileInput.value = '';
    currentFile = null; currentTags = null;
  }

  function handleFile(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const buf = e.target.result;
      try { currentTags = parseEXIF(buf) || {}; } catch { currentTags = {}; }
      const url = URL.createObjectURL(new Blob([buf]));
      previewEl.src = url;
      previewEl.onload = () => {
        const dims = previewEl.naturalWidth + ' \u00d7 ' + previewEl.naturalHeight;
        const size = (file.size / 1024).toFixed(1) + ' KB';
        fileInfoEl.innerHTML = `
          <div><strong>${escapeHTML(file.name)}</strong></div>
          <div>${dims} \u00b7 ${size}</div>
          <div>${file.type || 'unknown type'}</div>
        `;
        renderSections();
        uploadArea.style.display = 'none';
        resultEl.style.display = 'block';
      };
    };
    reader.readAsArrayBuffer(file);
  }

  function escapeHTML(s) { return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }

  function renderSections() {
    const t = currentTags || {};
    const groups = {
      'Camera': ['Make', 'Model', 'LensMake', 'LensModel', 'LensSpecification', 'Software', 'CameraOwnerName', 'BodySerialNumber', 'LensSerialNumber'],
      'Capture settings': ['ISOSpeedRatings', 'FNumber', 'ExposureTime', 'ShutterSpeedValue', 'FocalLength', 'FocalLengthIn35mmFilm', 'Flash', 'MeteringMode', 'WhiteBalance', 'ExposureProgram', 'ExposureMode', 'ExposureBiasValue', 'ApertureValue'],
      'Date / Time': ['DateTime', 'DateTimeOriginal', 'DateTimeDigitized', 'SubSecTime', 'SubSecTimeOriginal', 'GPSDateStamp', 'GPSTimeStamp'],
      'Image': ['ImageWidth', 'ImageLength', 'PixelXDimension', 'PixelYDimension', 'Orientation', 'ColorSpace', 'XResolution', 'YResolution', 'ResolutionUnit', 'Compression', 'BitDepth']
    };
    sectionsEl.innerHTML = '';

    for (const group of Object.keys(groups)) {
      const sec = document.createElement('div');
      sec.className = 'section';
      sec.innerHTML = `<h3>${group}</h3>`;
      let any = false;
      for (const key of groups[group]) {
        if (key in t) {
          const row = document.createElement('div');
          row.className = 'tag-row';
          row.innerHTML = `<span class="tag-key">${key}</span><span class="tag-val">${escapeHTML(formatTagValue(key, t[key]))}</span>`;
          sec.appendChild(row);
          any = true;
        }
      }
      if (!any) sec.innerHTML += '<div class="empty-msg">No data</div>';
      sectionsEl.appendChild(sec);
    }

    // GPS
    const gpsSec = document.createElement('div');
    gpsSec.className = 'section';
    gpsSec.innerHTML = '<h3>GPS</h3>';
    if (t.GPSLatitude && t.GPSLongitude) {
      const lat = gpsToDecimal(t.GPSLatitude, t.GPSLatitudeRef);
      const lng = gpsToDecimal(t.GPSLongitude, t.GPSLongitudeRef);
      if (lat !== null && lng !== null) {
        gpsSec.innerHTML += `<div class="tag-row"><span class="tag-key">Latitude</span><span class="tag-val">${lat.toFixed(6)} (${toDMS(lat, true)})</span></div>`;
        gpsSec.innerHTML += `<div class="tag-row"><span class="tag-key">Longitude</span><span class="tag-val">${lng.toFixed(6)} (${toDMS(lng, false)})</span></div>`;
        if (t.GPSAltitude != null) gpsSec.innerHTML += `<div class="tag-row"><span class="tag-key">Altitude</span><span class="tag-val">${formatTagValue('GPSAltitude', t.GPSAltitude)} m</span></div>`;
        if (t.GPSImgDirection != null) gpsSec.innerHTML += `<div class="tag-row"><span class="tag-key">Direction</span><span class="tag-val">${formatTagValue('GPSImgDirection', t.GPSImgDirection)}°</span></div>`;
        if (t.GPSSpeed != null) gpsSec.innerHTML += `<div class="tag-row"><span class="tag-key">Speed</span><span class="tag-val">${formatTagValue('GPSSpeed', t.GPSSpeed)}</span></div>`;
        const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=14`;
        gpsSec.innerHTML += `<div class="tag-row"><span class="tag-key">Map</span><span class="tag-val"><a href="${url}" target="_blank" rel="noopener">View on OpenStreetMap</a></span></div>`;
      }
    } else {
      gpsSec.innerHTML += '<div class="empty-msg">No GPS data</div>';
    }
    sectionsEl.appendChild(gpsSec);

    // Other (all remaining)
    const usedKeys = new Set();
    for (const g of Object.values(groups)) for (const k of g) usedKeys.add(k);
    usedKeys.add('GPSLatitude'); usedKeys.add('GPSLongitude'); usedKeys.add('GPSLatitudeRef'); usedKeys.add('GPSLongitudeRef'); usedKeys.add('GPSAltitude'); usedKeys.add('GPSAltitudeRef'); usedKeys.add('GPSImgDirection'); usedKeys.add('GPSImgDirectionRef'); usedKeys.add('GPSSpeed'); usedKeys.add('GPSSpeedRef'); usedKeys.add('ExifIFDPointer'); usedKeys.add('GPSIFDPointer');
    const others = Object.keys(t).filter(k => !usedKeys.has(k));
    if (others.length) {
      const det = document.createElement('details');
      det.className = 'other';
      det.innerHTML = `<summary>Other tags (${others.length})</summary><div class="section"></div>`;
      const inner = det.querySelector('.section');
      for (const k of others) {
        const row = document.createElement('div');
        row.className = 'tag-row';
        row.innerHTML = `<span class="tag-key">${k}</span><span class="tag-val">${escapeHTML(formatTagValue(k, t[k]))}</span>`;
        inner.appendChild(row);
      }
      sectionsEl.appendChild(det);
    }

    rawEl.value = JSON.stringify(t, (k, v) => {
      if (typeof v === 'bigint') return v.toString();
      return v;
    }, 2);
  }

  function stripAndDownload() {
    if (!currentFile) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const type = currentFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      c.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = currentFile.name.replace(/\.[^.]+$/, '');
        a.download = baseName + '-stripped.' + (type === 'image/png' ? 'png' : 'jpg');
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, type, 0.92);
    };
    img.src = previewEl.src;
  }
})();
