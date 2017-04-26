export function normalizeSelectedIndex(selectedIndex, count) {
  const max = count + 1;
  let index = selectedIndex % max;

  if (index < 0) {
    index += max;
  }

  return index;
}

export function noop() {}
