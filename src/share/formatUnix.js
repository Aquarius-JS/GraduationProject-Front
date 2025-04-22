/**
 * @description: 将Unix时间戳转换为日期格式
 * @param {number} unixTime - Unix时间戳
 */
export default (unixTime, type = '/') => {
  if (type === 'ch') {
    const date = new Date(unixTime * 1000);

    // 提取年、月、日、时、分、秒
    const year = date.getFullYear(); // 年
    const month = date.getMonth() + 1; // 月（getMonth() 返回 0-11，需要加 1）
    const day = date.getDate(); // 日
    const hours = date.getHours().toString().padStart(2, '0'); // 时（补零）
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 分（补零）
    const seconds = date.getSeconds().toString().padStart(2, '0'); // 秒（补零）

    // 拼接格式化后的日期和时间
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  } else {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString('zh-CN', { hour12: false }).replaceAll('/', type);
  }
};

/**
 * @description: 将Unix时间戳转换为日期格式
 * @param {number} unixTime - Unix时间戳
 */
export const formatUnixToDate = (unixTime, type = '/') => {
  const date = new Date(unixTime * 1000);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return month + type + day;
};
