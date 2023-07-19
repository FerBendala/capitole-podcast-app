module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.scss$': 'jest-scss-transform',
    },
}
