/**
 * @param {string} text
 * @returns {Array.<{ text: string, start: number, stop: number }>}
 */
export function extractOperatorsFromText(text) {
  return [];
}

export function regexLastOffset(regex, text) {
  let offset = 0;
  let res = regex.exec(text);

  while (res !== null) {
    offset = res[0].length + res.index;
    res = regex.exec(text);
  }

  return offset;
}

export function termStartIndex(query) {
  return regexLastOffset(/\s(OR|AND)\s/g, query);
}

export function normalizeSelectedIndex(selectedIndex, count) {
  const max = count + 1;
  let index = selectedIndex % max;

  if (index < 0) {
    index += max;
  }

  return index;
}
