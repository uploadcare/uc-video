export const createSrcVideoAdaptive = (cdnUrl: string, uuid: string) => {
  const url = new URL(cdnUrl);
  url.pathname = `${uuid}/adaptive_video/`;
  return url.toString()
};
