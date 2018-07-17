import { concatMap, mapTo } from 'rxjs/operators';
//@ts-ignore
import prettier from 'prettier';

import path from 'path';
import fs from 'fs';
import { Observable, bindNodeCallback } from 'rxjs';
import { Project } from '../index';

const writeFile = bindNodeCallback(fs.writeFile);
const readFile = bindNodeCallback(fs.readFile);

const getJestConfig = (): Object => {
  return {
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
};

export default () => (source$: Observable<Project>): Observable<Project> =>
  source$.pipe(
    concatMap((projectName: string) =>
      writeFile(
        path.join(process.cwd(), projectName, 'jest.config.js'),
        `module.exports=${JSON.stringify(getJestConfig(), null, 2)}`
      ).pipe(
        concatMap(() =>
          readFile(
            path.join(process.cwd(), projectName, 'jest.config.js')
          ).pipe(
            concatMap((fileData: Buffer) =>
              writeFile(
                path.join(process.cwd(), projectName, 'jest.config.js'),
                prettier.format(fileData.toString(), {
                  singleQuote: true,
                  trailingComma: 'es5',
                  parser: 'babylon',
                })
              )
            )
          )
        ),
        mapTo(projectName)
      )
    )
  );
