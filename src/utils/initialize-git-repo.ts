import { Observable, merge, fromEvent } from 'rxjs';
import { concatMap, mapTo } from 'rxjs/operators';
import { Project } from '../index';
import { spawn } from 'child_process';
import path from 'path';

export default () => (source$: Observable<Project>): Observable<Project> => {
  return source$.pipe(
    concatMap((projectName: Project) => {
      const p = spawn('git', ['init'], {
        cwd: path.join(process.cwd(), projectName),
      });
      return merge(fromEvent(p, 'exit'), fromEvent(p, 'error')).pipe(
        concatMap(() => {
          const p = spawn('git', ['add', '.'], {
            cwd: path.join(process.cwd(), projectName),
          });

          return merge(fromEvent(p, 'exit'), fromEvent(p, 'error'));
        }),
        concatMap(() => {
          const p = spawn('git', ['commit', '-m', 'inital commit'], {
            cwd: path.join(process.cwd(), projectName),
          });

          return merge(fromEvent(p, 'exit'), fromEvent(p, 'error'));
        }),
        mapTo(projectName)
      );
    })
  );
};
