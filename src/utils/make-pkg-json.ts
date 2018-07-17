import { concatMap, mapTo } from 'rxjs/operators';

import path from 'path';
import fs from 'fs';
import { Observable, bindNodeCallback } from 'rxjs';
import { Project } from '../index';

const writeFile = bindNodeCallback(fs.writeFile);

const getPackageJSON = (projectName: Project): Object => {
  return {
    name: projectName,
    version: '1.0.0',
    description: '',
    main: 'build/index.js',
    scripts: {
      prepublishOnly: 'yarn build',
      build: 'tsc',
      start: 'nodemon build/index.js',
      test: 'jest',
    },
    repository: {
      type: 'git',
      url: '',
    },
    author: '',
    license: '',
    devDependencies: {
      '@types/node': '^10.5.2',
      typescript: '^2.9.2',
      '@types/jest': '^23.1.6',
      jest: '^23.4.1',
      nodemon: '^1.18.2',
      prettier: '^1.13.7',
      'ts-jest': '^23.0.0',
    },
  };
};

export default () => (source$: Observable<Project>): Observable<Project> =>
  source$.pipe(
    concatMap((projectName: string) =>
      writeFile(
        path.join(process.cwd(), projectName, 'package.json'),
        JSON.stringify(getPackageJSON(projectName), null, 2)
      ).pipe(mapTo(projectName))
    )
  );
