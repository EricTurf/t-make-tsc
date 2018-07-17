#!/usr/bin/env node
import { of, bindNodeCallback, Observable } from 'rxjs';
import { concatMap, mapTo, tap } from 'rxjs/operators';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
//@ts-ignore
import { version } from '../package.json';
console.log(version);

import makePkgJson from './utils/make-pkg-json';
import makeJestConfig from './utils/make-jest-config';
import yarnInstall from './utils/yarn-install';
import makeTsConfig from './utils/make-tsconfig';
import makePrettierrc from './utils/make-prettierrc';
import makeGitIgnore from './utils/make-git-ignore';
import initializeGitRepo from './utils/initialize-git-repo';
import makeSrcDirectory from './utils/make-src-folder';
import prettyQuick from './utils/pretty-quick';

import commander from 'commander';

export type Project = string;

const mkdir = bindNodeCallback(fs.mkdir);

const createProject = (projectName: string): Observable<any> =>
  of(projectName).pipe(
    tap(() => console.log(`Creating directory ${chalk.cyan(projectName)}`)),
    concatMap((projectName: Project) =>
      mkdir(path.join(process.cwd(), projectName)).pipe(mapTo(projectName))
    ),
    tap(() =>
      console.log(`Finished creating directory ${chalk.cyan(projectName)}`)
    ),
    tap(() => console.log(`Creating ${chalk.cyan('package.json')}`)),
    makePkgJson(),
    tap(() => console.log(`Finished creating ${chalk.cyan('package.json')}`)),
    tap(() => console.log(`Creating ${chalk.cyan('tsconfig.json')}`)),
    makeTsConfig(),
    tap(() => console.log(`Finished creating ${chalk.cyan('tsconfig.json')}`)),
    tap(() => console.log(`Creating ${chalk.cyan('jest.config.js')}`)),
    makeJestConfig(),
    tap(() => console.log(`Finished creating ${chalk.cyan('jest.config.js')}`)),
    tap(() => console.log(`Creating ${chalk.cyan('.prettierrc')}`)),
    makePrettierrc(),
    tap(() => console.log(`Finished creating ${chalk.cyan('.prettierrc')}`)),
    tap(() => console.log(`Creating ${chalk.cyan('.gitignore')}`)),
    makeGitIgnore(),
    tap(() => console.log(`Finished creating ${chalk.cyan('.gitignore')}`)),
    tap(() => console.log(`Creating ${chalk.cyan('src')} directory`)),
    makeSrcDirectory(),
    prettyQuick(),
    tap(() => console.log(`Finished creating ${chalk.cyan('src')} directory`)),
    tap(() => console.log(`Running ${chalk.cyan('yarn install')}`)),
    yarnInstall(),
    tap(() => console.log(`${chalk.cyan('yarn install complete')}`)),
    tap(() =>
      console.log(`Creating inital git repo and commiting inital files`)
    ),
    initializeGitRepo()
  );

commander
  .version(version)
  .command('* [projectName]')
  .description('Creates a base Typescript project with the given project name.')
  .action(projectName =>
    createProject(projectName).subscribe({
      next() {
        console.log(`Done creating ${chalk.cyan(projectName)}`);
      },
    })
  );

commander.parse(process.argv);
