
/**
 * Mock implementation of next/headers for the browser preview environment.
 */
export const cookies = async () => {
  return {
    get: (name: string) => {
      const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))
        ?.split('=')[1];
      return value ? { name, value } : undefined;
    },
    getAll: () => {
      return document.cookie.split('; ').map((row) => {
        const [name, value] = row.split('=');
        return { name, value };
      });
    },
    set: (name: string, value: string, options?: any) => {
      let cookieString = `${name}=${value}`;
      if (options?.path) cookieString += `; path=${options.path}`;
      if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`;
      document.cookie = cookieString;
    },
    delete: (name: string) => {
      document.cookie = `${name}=; max-age=0`;
    }
  };
};

export default { cookies };
