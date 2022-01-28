export const parseDate = (timestamp) => {
  if (!timestamp) {
    return '';
  }
  var newDate = new Date(timestamp).toLocaleString();
  let [date, time] = newDate.split(', ');
  let [d, mo, y] = date.split('.');
  let [h, mi, s] = time.split(':');
  let q = '';
  if (date.includes('/')) {
    [mo, d, y] = date.split('/');
    [s, q] = s.split(' ');
  }
  return y + '-' + mo + '-' + d + ' ' + h + ':' + mi+ ':' + s + (q ? ' ' + q : '');
};