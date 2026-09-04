export function scopedFilter(auth, extra = {}) {
  return { ...extra, user: auth.userId };
}
