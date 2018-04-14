import stringWidth from './stringWidth';

export default function getContextArr(testT, width) {
  let lineCount = 16; //十六行
  let lineWidth = Math.floor((width - 40) * 2 / 23); //24是字体大小，后来属性配置可以修改一下
  let lines = parseContent(testT, lineWidth);
  let pages = [];
  let pageCount = (lines.length / lineCount >> 0) + (lines.length % lineCount == 0 ? 0 : 1);
  for (let i = 0; i < pageCount; i++) {
    pages[i] = '';
    for (let j = i * 16, k = j + 16 > lines.length ? lines.length : j + 16; j < k; j++) {
      pages[i] += `${lines[j]}\n`;
    }
  }
  return {
    pages,
    pageCount
  };
}

function parseContent(str, width, cleanEmptyLine = true) {
  if (!str || str == '' || typeof (str) != 'string') {
    return [];
  }
  str = cleanContent(str);
  let lines = [];
  let currentLine = '';
  let currentLineWidth = 0;
  for (let i in str) {
    let s = str[i];
    let code = s.charCodeAt();
    if (code == 8220 || code == 8221) {
      s = '"';
    } else if (code == 8216 || code == 8217) {
      s = '\'';
    } else if (code >= 48 && code <= 56 || code >= 65 && code <= 91 || code >= 97 && code <= 122) {
      s = String.fromCharCode(code + 65248);  //宽字符的数字、大小写字母转换
    } else if (code == 10 || code == 13) {  // 10是换行符
      if (currentLine.trim() !== '') {
        lines.push(currentLine);
      }
      currentLine = '';
      currentLineWidth = 0;
      continue;
    }
    let sWidth = stringWidth(s);
    if (currentLineWidth + sWidth > width) {
      lines.push(currentLine);
      currentLine = '';
      currentLineWidth = 0;
    }
    currentLine += s;
    currentLineWidth += sWidth;
  }
  lines.push(currentLine);
  return lines;
}

function cleanContent(str) {
  let lines = str.split('\n');
  let newlines = [];
  lines.filter((x) => {
    newlines.push(`\u3000\u3000${x.trim()}`);
  });
  return newlines.join('\n\n');
}