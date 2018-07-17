import { concatMap, mapTo } from 'rxjs/operators';

import path from 'path';
import fs from 'fs';
import { Observable, bindNodeCallback } from 'rxjs';
import { Project } from '../index';

const writeFile = bindNodeCallback(fs.writeFile);

const getTsConfig = (): Object => {
  return {
    compilerOptions: {
      target: 'es6',
      module: 'commonjs',
      outDir: './build',
      rootDir: './src',
      strict: true,
      noImplicitAny: true,
      moduleResolution: 'node',
      baseUrl: './',
      esModuleInterop: true,
    },
  };
};

export default () => (source$: Observable<Project>): Observable<Project> =>
  source$.pipe(
    concatMap((projectName: string) =>
      writeFile(
        path.join(process.cwd(), projectName, 'tsconfig.json'),
        JSON.stringify(getTsConfig(), null, 2)
      ).pipe(mapTo(projectName))
    )
  );
