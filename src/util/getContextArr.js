export default function getContextArr(testT, width, line = 16) {
  // 40 是两边的margin，23是字体大小
  let lineWidth = Math.floor(((width - 40) * 2) / 23);
  let lines = parseContent(testT, lineWidth);
  let pages = [];
  let pageCount =
    ((lines.length / line) >> 0) + (lines.length % line == 0 ? 0 : 1);
  for (let i = 0; i < pageCount; i++) {
    pages[i] = '';
    for (
      let j = i * line, k = j + line > lines.length ? lines.length : j + line;
      j < k;
      j++
    ) {
      pages[i] += `${lines[j]}\n`;
    }
  }
  return {
    pages,
    pageCount
  };
}

function parseContent(str, width, cleanEmptyLine = true) {
  if (!str || str == '' || typeof str != 'string') {
    return [];
  }
  str = cleanContent(str);
  let lines = [];
  let currentLine = '';
  let currentLineWidth = 0;
  for (let i = 0, j = str.length; i < j; i++) {
    let s = str.charAt(i) || '';
    const code = s.codePointAt();
    if (code == 8220 || code == 8221) {
      s = '"';
    } else if (code == 8216 || code == 8217) {
      s = "'";
    } else if (
      (code >= 48 && code <= 56) ||
      (code >= 65 && code <= 91) ||
      (code >= 97 && code <= 122)
    ) {
      s = String.fromCharCode(code + 65248); //宽字符的数字、大小写字母转换
    } else if (code == 10 || code == 13) {
      // 10是换行符
      if (currentLine.trim() !== '') {
        lines.push(currentLine);
      }
      currentLine = '';
      currentLineWidth = 0;
      continue;
    }
    const sWidth = getRealStrLength(s);
    if (currentLineWidth + sWidth > width) {
      if (currentLine.trim() !== '') {
        lines.push(currentLine);
      }
      currentLine = '';
      currentLineWidth = 0;
    }
    currentLine += s;
    currentLineWidth += sWidth;
  }
  if (currentLine.trim() !== '') {
    lines.push(currentLine);
  }
  return lines;
}

function cleanContent(str) {
  let lines = str.split('\n');
  let newlines = [];
  lines.filter(x => {
    newlines.push(`\u3000\u3000${x.trim()}`);
  });
  return newlines.join('\n\n');
}

function getRealStrLength(str) {
  if (typeof str !== 'string' || str.length === 0) return 0;
  let realLength = 0;
  let charCode;
  for (let i = 0, len = str.length; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0x0000 && charCode <= 0x00ff) realLength += 1;
    else realLength += 2;
  }
  return realLength;
}
