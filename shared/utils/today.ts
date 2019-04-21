export function today() {
  const tod = new Date();
  const year = tod.getFullYear();
  const month = tod.getMonth() + 1;
  const day = tod.getDate();

  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
}
