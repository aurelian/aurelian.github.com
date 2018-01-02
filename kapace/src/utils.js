
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [
    h,
    m > 9 ? m : '0' + m,
    s > 9 ? Math.round(s) : '0' + Math.round(s),
  ].filter(s => s).join(':');
}

export {formatTime};

