const NUM_OF_SIBLINGS = 1;

const generatePages = ({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) => {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_value, i) => i + 1);
  }

  const pages = Array.from({ length: NUM_OF_SIBLINGS * 2 + 1 }, (_value, i) => {
    const page = currentPage - NUM_OF_SIBLINGS + i;

    return page > 0 && page <= pageCount ? page : null;
  }).filter(Boolean) as ("..." | number)[];

  if (Number(pages[1]) > 2) {
    pages.unshift("...");
  }

  if (!pages.includes(pageCount)) {
    if (Number(pages[pages.length - 1]) < pageCount) {
      pages.push("...");
    }
  }

  return pages;
};

export { generatePages };
