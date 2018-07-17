//@ts-ignore
import https from 'https';
import axios, { AxiosResponse } from 'axios';
import { from, bindNodeCallback, Observable } from 'rxjs';
import { tap, concatMap, mapTo } from 'rxjs/operators';
import fs from 'fs';
import path from 'path';
import { Project } from '../index';

const writeFile = bindNodeCallback(fs.writeFile);

export default () => (source$: Observable<Project>): Observable<Project> => {
  return source$.pipe(
    concatMap((projectName: Project) =>
      from(axios('https://api.github.com/gitignore/templates/Node')).pipe(
        concatMap((res: AxiosResponse) =>
          writeFile(
            path.join(process.cwd(), projectName, '.gitignore'),
            res.data.source
          ).pipe(mapTo(projectName))
        )
      )
    )
  );
};
