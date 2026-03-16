export const modes = [
  { title: 'Створити лобі', online: 0, tag: 'Lobby', accent: '#7dd3fc' },
  { title: 'Deathmatch', online: 0, tag: 'Warmup', accent: '#fb7185' },
  { title: '5x5', online: 0, tag: 'Team', accent: '#34d399' },
  { title: 'Duels', online: 0, tag: '1v1', accent: '#fbbf24' },
  { title: 'AWP', online: 0, tag: 'Sniper', accent: '#c084fc' },

  // НОВА ПЛИТКА
  {
    title: 'Режим сідого',
    online: 0,
    tag: 'Fun',
    accent: '#f59e0b',
    badge: 'Fun',
  },
] as const;
