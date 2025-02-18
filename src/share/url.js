/**
 * 修改query string参数
 * @param {string} paramName
 * @param {string} paramValue
 */
function updateURLParameter(paramName, paramValue) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  if (params.has(paramName)) {
    params.set(paramName, paramValue);
  } else {
    params.append(paramName, paramValue);
  }

  const newUrl = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}
/**
 * 获取url查询字符串对象
 * @returns {object}
 */
function getURLParameter() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const entries = params.entries();
  const result = {};
  for (const entry of entries) {
    result[entry[0]] = entry[1];
  }

  return result;
}

export { getURLParameter, updateURLParameter };
