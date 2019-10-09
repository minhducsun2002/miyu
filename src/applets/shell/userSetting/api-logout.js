export default async () => fetch('/api/logout').then(res => res.ok).catch(() => false);
