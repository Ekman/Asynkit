import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "\\.ts$": ["ts-jest", {useESM: true}],
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    }
}

export default config;