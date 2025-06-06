export function generateQueryRange<I>(from: I, to: I) {
  const query: { gte?: any; lte?: any } = {};
  let isHaveQuery = false;
  if (from || Number.isInteger(from)) {
    query.gte = from;
    isHaveQuery = true;
  }
  if (to || Number.isInteger(to)) {
    query.lte = to;
    isHaveQuery = true;
  }

  return isHaveQuery ? query : null;
}
