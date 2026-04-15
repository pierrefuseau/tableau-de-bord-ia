export function getMonthStart(date = new Date()): string {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
}

export function getMonthEnd(date = new Date()): string {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
}

export function getPreviousMonthRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
}

export function getCurrentMonthRange(): { startDate: string; endDate: string } {
  return { startDate: getMonthStart(), endDate: getMonthEnd() };
}
