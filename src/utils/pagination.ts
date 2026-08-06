export function paginate<T>(rows: T[], page: number, pageSize: number) {
  return rows.slice((page - 1) * pageSize, page * pageSize);
}
