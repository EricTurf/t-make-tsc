import { Observable, bindNodeCallback } from 'rxjs';
import { Project } from '../index';
import fs from 'fs';
import path from 'path';
import { concatMap, mapTo } from 'rxjs/operators';

const mkdir = bindNodeCallback(fs.mkdir);
const writeFile = bindNodeCallback(fs.writeFile);

export default () => (source$: Observable<Project>): Observable<Project> =>
  source$.pipe(
    concatMap((projectName: Project) =>
      mkdir(path.join(process.cwd(), projectName, 'src')).pipe(
        concatMap(() =>
          writeFile(
            path.join(process.cwd(), projectName, 'src', 'index.ts'),
            ''
          ).pipe(mapTo(projectName))
        )
      )
    )
  );
