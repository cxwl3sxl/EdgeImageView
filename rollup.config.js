const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

module.exports = [

  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'umd',
        entryFileNames: 'index.umd.js',
        name: 'FE_utils', // umd模块名称，相当于一个命名空间，会自动挂载到window下面
        sourcemap: false,
      },
    ],
    plugins: [resolve(), typescript({ module: "ESNext"})],
  }
]

