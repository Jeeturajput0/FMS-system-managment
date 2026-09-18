/** Split an array into chunks of `perPage` (default 4). */
export const chunkPairs = (pairs, perPage = 4) => {
  const pages = [];
  for (let i = 0; i < pairs.length; i += perPage) {
    pages.push(pairs.slice(i, i + perPage));
  }
  return pages;
};
