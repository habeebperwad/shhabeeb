function geturl(uri: string) {
  // TODO move to config
  const BASE_URL = "http://127.0.0.1:3100";
  return BASE_URL + uri;
}

export { geturl };
