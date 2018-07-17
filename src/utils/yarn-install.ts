import { Observable, merge, fromEvent } from 'rxjs';
import { concatMap, mapTo } from 'rxjs/operators';
import { Project } from '../index';
import { spawn } from 'child_process';
import path from 'path';

export default () => (source$: Observable<Project>): Observable<Project> => {
  return source$.pipe(
    concatMap((projectName: Project) => {
      const p = spawn('yarn', ['install'], {
        cwd: path.join(process.cwd(), projectName),
      });
      return merge(fromEvent(p, 'exit'), fromEvent(p, 'error')).pipe(
        mapTo(projectName)
      );
    })
  );
};
