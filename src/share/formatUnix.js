export default unixTime => {
  const date = new Date(unixTime * 1000);
  return date.toLocaleString('zh-CN', { hour12: false });
};
