export default {
  input: './src/index.js',
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    preserveModules: true,
    exports: 'auto',
    // astronomia's CommonJS data files set __esModule and keep the data on
    // .default; 'compat' reads it from there instead of the whole module
    interop: 'compat'
  }
}
