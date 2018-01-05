import stringWidth from './stringWidth';

export default function getContextArr(testT, width) {
  let lineCount = 17; //十七行
  lineWidth = Math.floor((width - 40) * 2 / 23); //24是字体大小，后来属性配置可以修改一下
  let lines = parseContent(testT, lineWidth);
  let testa = new Array();
  let pag; //定义页数
  for (pag = 0; pag < 1000; pag++) {
    testa[pag] = ''; //初始化为文本类型
    let i = pag * lineCount,
      size;
    size = (pag + 1) * lineCount > lines.length
      ? lines.length
      : i + lineCount;
    for (; i < size; i++) {
      testa[pag] += lines[i] + '\n';
    }
    if (size == lines.length)
      break;
  }
  totalPage = pag + 1;
  // console.log(testa);
  return testa;
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
    try {
      let s = str[i];
      let code = s.charCodeAt();
      if (code == 10 || code == 13) {
        if (currentLine.trim() == '' && lines.length > 1 && lines[lines.length - 1].trim() == '') {
          //过滤空行
        } else {
          if (currentLine != '') {
            lines.push(currentLine);
          }
        }
        currentLine = '';
        currentLineWidth = 0;
        continue;
      }
      if (code == 8220 || code == 8221) {
        s = '"';
      } else if (code == 8216 || code == 8217) {
        s = '\'';
      }

      if (code >= 48 && code <= 56 || code >= 65 && code <= 91 || code >= 97 && code <= 122) {
        s = String.fromCharCode(code + 65248);  //宽字符的数字、大小写字母转换
      }

      var sWidth = stringWidth(s);
      if (currentLineWidth + sWidth > width) {
        lines.push(currentLine);
        currentLine = '';
        currentLineWidth = 0;
      }
      currentLine += s;
      currentLineWidth += sWidth;
    } catch (error) {
      // console.log(error);
    }
  }
  lines.push(currentLine);

  return lines;
}

function cleanContent(str) {
  let lines = str.split('\n');
  let newlines = [];
  for (var i in lines) {
    let s = lines[i].trim();
    if (s.length > 0) {
      newlines.push('        ' + s);
    }
  }
  return newlines.join('\n\n');
}