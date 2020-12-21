import { resolve } from 'path';

export default function resolveDirs(paths) {
  return {
    name: 'resolve-dirs',
    async resolveId(id) {
      const foundMatch = paths.some(
        path => id === path || id.startsWith(path + '/'),
      );
      if (!foundMatch) return;
      const resolveResult = await this.resolve('./src/' + id, './');
      if (!resolveResult) {
        throw new Error(`Couldn't find ${'./' + id}`);
      }
      return resolve(resolveResult.id);
    },
  };
}