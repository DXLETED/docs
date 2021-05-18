export type RequestStatus = 'loading' | 'done' | 'error'

export const requestsStatus = (...statuses: RequestStatus[]): RequestStatus =>
  (statuses.every(s => s === 'done') && 'done') || (statuses.some(s => s === 'error') && 'error') || 'loading'
