import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
  // ESM build to be used with webpack/rollup.
  // {
  //   input: 'src/entry.js',
  //   output: {
  //     format: 'esm',
  //     file: 'dist/contentarchitect.esm.js',
  //     globals: {
  //       vue: "Vue"
  //     }
  //   },
  //   external: [
  //     'Vue'
  //   ],
  //   plugins: [
  //     commonjs(),
  //     vue()
  //   ] 
  // },
  // Browser build.
  {
    input: 'src/entry.js',
    output: {
      format: 'iife',
      file: 'dist/contentarchitect.iife.js',
      name: "Contentarchitect",
      globals: {
        vue: "Vue",
        paragraph: "Paragraph"
      }
    },
    external: [
      'Vue'
    ],
    plugins: [
      commonjs(),
      vue(),
      resolve()
    ]
  }
]