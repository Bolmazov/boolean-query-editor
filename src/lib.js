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

export function noop() {}

/**
 * Checks if input is a string
 * @param {*} input
 * @returns {boolean}
 */
export function isString(input) {
  return Object.prototype.toString.call(input) === '[object String]';
}
