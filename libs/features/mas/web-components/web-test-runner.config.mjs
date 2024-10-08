import { importMapsPlugin } from '@web/dev-server-import-maps';
import { defaultReporter } from '@web/test-runner';
import { chromeLauncher } from '@web/test-runner-chrome';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { testRunnerDeviceEmulator } from './test/plugin/test-runner-device-emulator.js';
import { pixelMatchDiff } from './test/plugin/pixel-match-diff.js';

async function enableCORS(context, next) {
    await next();
    context.set('Access-Control-Allow-Credentials', true);
    context.set('Access-Control-Allow-Origin', context.request.headers.origin);
}

export default {
    browsers: [
        chromeLauncher({
            launchOptions: { args: ['--no-sandbox'] },
        }),
    ],
    coverageConfig: {
        include: ['src/**'],
        exclude: [
            'test/mocks/**',
            'test/**',
            '**/node_modules/**',
            'src/merch-twp-d2p.js', // on hold
            'src/aem.js', // WIP
            'src/bodyScrollLock.js', // todo
            'src/merch-subscription-panel.js', // on hold
            'src/ merch-whats-included.js', // on hold
        ],
        threshold: {
            // TODO bump to 100%
            branches: 85,
            functions: 65,
            statements: 85,
            lines: 85,
        },
    },
    debug: false,
    files: ['test/**/*.test.(js|html)'],
    nodeResolve: true,
    middlewares: [enableCORS],
    testFramework: {
        config: {
            timeout: 10000, // timeout in milliseconds
        },
    },
    plugins: [
        importMapsPlugin({
            inject: {
                importMap: {
                    imports: {
                        react: '/test/mocks/react.js',
                        '@pandora/fetch': '/test/mocks/pandora-fetch.js',
                    },
                },
            },
        }),
        testRunnerDeviceEmulator(),
        visualRegressionPlugin({
            getImageDiff: pixelMatchDiff,
            diffOptions: {
                threshold: 0.1,
            },
        }),
    ],
    port: 2023,
    reporters: [
        defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    ],
};
