export function sortStringToQueryBuilder(qb: any, sortString: string) {
  const sorts = sortString.split(',');
  for (const sort of sorts) {
    const desc = sort.charAt(0) === '-';
    const orderBy = desc ? sort.slice(1) : sort;
    qb = qb.orderBy(orderBy, desc ? 'DESC' : 'ASC');
  }
  return qb;
}

export function sortStringToFindOptions(options: { sort?: string }) {
  if (options.sort) {
    const sortString = options.sort;
    const sorts = sortString.split(',');
    const order = {};
    for (const sort of sorts) {
      const desc = sort.charAt(0) === '-';
      const sortKey = desc ? sort.slice(1) : sort;
      const sortOrder = desc ? 'DESC' : 'ASC';
      order[sortKey] = sortOrder;
    }
    delete options.sort;
  }
}
