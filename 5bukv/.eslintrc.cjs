const { require } = require("module")

module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module"
    },
    env: {
        es6: true,
        browser: true
    },
    plugins: [
        "@typescript-eslint",
        "svelte3",
    ],
    ignorePatterns: ["public/build/", 'node_modules'],
    extends: ["eslint:recommended"],
    overrides: [
        {
            files: ["**/*.svelte"],
            processor: "svelte3/svelte3",
            rules: {
                semi: ["error", "never"],
                indent: ["error", 4],
                quotes: ["error", "double"],
                "linebreak-style": ["error", "unix"],
                "eol-last": ["error", "always"],
                "object-curly-spacing": ["error", "always"],
                "array-bracket-spacing": ["error", "never"],
                "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
                "@typescript-eslint/no-unused-vars": ["warn"],
            }
        }
    ],
    settings: {
        "svelte3/typescript": require("typescript"),
        // ignore style tags in Svelte because of Tailwind CSS
        // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
        "svelte3/ignore-styles": () => true
    },
    rules: {
        semi: ["error", "never"],
        indent: ["error", 4],
        quotes: ["error", "double"],
        "linebreak-style": ["error", "unix"],
        "eol-last": ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "never"],
        "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
        "@typescript-eslint/no-unused-vars": ["warn"],
    }
}
