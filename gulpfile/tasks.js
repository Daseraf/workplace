const { appConfig, workplaceConfig, resolveApp } = require('./config');

const { watchStyles,
  watchLintStyles, watchLintJs,
  watchLive,
} = require('./watch');
const { lintStyle, lintJs, fixStyle, fixJs } = require('./lint');
const { compileStyle } = require('./style');
const { composeStart } = require('./docker');

const styleGlob = appConfig.workplace.theme.map(f => resolveApp(`${f}/scss`));
console.log('styleGlob', styleGlob);

const lintJsGlob = [
  ...[
    resolveApp('app/code'),
    '!node_modules',
    `!${resolveApp('app/code')}/**/web/js/vendor`,
  ],
  ...appConfig.workplace.theme.map(f => resolveApp(f)),
  ...appConfig.workplace.theme.map(f => `!${resolveApp(`${f}/js/mage/`)}`),
  ...appConfig.workplace.theme.map(f => `!${resolveApp(`${f}/js/vendor/`)}`),
];
console.log('lintJsGlob', lintJsGlob);

const lintStyleGlob = [...styleGlob, ...styleGlob.map(f => `!${f}/vendor`)];
console.log('lintStyleGlob', lintStyleGlob);

// Tasks
const watchStylesTask = () => watchStyles(
  styleGlob.map((f) => `${f}/**/*.scss`)
);
watchStylesTask.displayName = 'watch style';

const watchLintStylesTask = () => watchLintStyles(
  lintStyleGlob.map((f) => `${f}/**/*.scss`)
);
watchLintStylesTask.displayName = 'watch lint scss';

const watchLintJsTask = () => watchLintJs(
  lintJsGlob.map((f) => `${f}/**/*.js`)
);
watchLintJsTask.displayName = 'watch lint js';

const liveTask = () => watchLive();
liveTask.displayName = 'livereload';

const dockerTask = (cb) => composeStart(cb, workplaceConfig);
dockerTask.displayName = 'docker';

const styleTask = () => compileStyle(
  styleGlob.map((f) => `${f}/**/*.scss`),
  styleTask,
  appConfig.workplace.theme.map(f => resolveApp(f))
);
styleTask.displayName = 'scss';

const lintJsTask = () => lintJs(lintJsGlob.map((f) => `${f}/**/*.js`));
lintJsTask.displayName = 'js lint';

const lintStyleTask = () => lintStyle(
  lintStyleGlob.map((f) => `${f}/**/*.scss`)
);
lintStyleTask.displayName = 'style lint';

const fixStyleTask = () => fixStyle(
  lintStyleGlob.map((f) => `${f}/**/*.scss`)
);
fixStyle.displayName = 'style lint autofix';

const fixJsTask = () => fixJs(
  lintJsGlob.map((f) => `${f}/**/*.js`)
);
fixJsTask.displayName = 'js lint autofix';

exports.lintStyleTask = lintStyleTask;
exports.lintJsTask = lintJsTask;
exports.dockerTask = dockerTask;
exports.watchStylesTask = watchStylesTask;
exports.watchLintStylesTask = watchLintStylesTask;
exports.watchLintJsTask = watchLintJsTask;
exports.liveTask = liveTask;
exports.styleTask = styleTask;
exports.fixStyleTask = fixStyleTask;
exports.fixJsTask = fixJsTask;