// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
    arrowParens: 'avoid',
    singleQuote: true,
    printWidth: 100,
    parser: "typescript",
    // importOrderSeparation: true,
    // importOrderSortSpecifiers: true,
    // importOrderParserPlugins: ["typescript", "jsx", "decorators"],
    // importOrder: ['<THIRD_PARTY_MODULES>', '^[@]', '^[../]', '^[./]'],
    // plugins: ['@trivago/prettier-plugin-sort-imports'],
}

export default config
