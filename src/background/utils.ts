
export const getSlug = (url: string): string => url.split('?')[0].split('/')[4];