import { concatMap, mapTo } from 'rxjs/operators';

import path from 'path';
import fs from 'fs';
import { Observable, bindNodeCallback } from 'rxjs';
import { Project } from '../index';

const writeFile = bindNodeCallback(fs.writeFile);

const getPrettierrc = (): Object => {
  return {
    singleQuote: true,
    trailingComma: 'es5',
  };
};

export default () => (source$: Observable<Project>): Observable<Project> =>
  source$.pipe(
    concatMap((projectName: string) =>
      writeFile(
        path.join(process.cwd(), projectName, 'tsconfig.json'),
        JSON.stringify(getPrettierrc(), null, 2)
      ).pipe(mapTo(projectName))
    )
  );
