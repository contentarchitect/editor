import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
// import resolve from 'rollup-plugin-node-resolve';
import vueSvg from 'rollup-plugin-vue-inline-svg';

export default [
  // ESM build to be used with webpack/rollup.
  {
    input: 'src/core/index.js',
    output: {
      dir: "dist",
      format: 'umd',
      entryFileNames: 'ContentArchitect.Core.js',
      name: "ContentArchitect.Core",
      globals: {
        vue: "Vue"
      }
    },
    external: [
      'Vue'
    ],
    plugins: [
      commonjs(),
      vue(),
      vueSvg(),
    ]
  },
  {
    input: 'src/editor.js',
    output: {
      dir: "dist",
      format: 'umd',
      entryFileNames: 'ContentArchitect.Editor.js',
      name: "ContentArchitect.Editor",
      globals: {
        vue: "Vue",
        "@contentarchitect/core": "ContentArchitect.Core"
      }
    },
    external: [
      'Vue',
      '@contentarchitect/core'
    ],
    plugins: [
      commonjs(),
      vue(),
      vueSvg(),
    ]
  },
  // Browser build.
  // {
  //   input: 'src/entry.js',
  //   output: {
  //     format: 'iife',
  //     file: 'dist/contentarchitect.iife.js',
  //     name: "Contentarchitect",
  //     globals: {
  //       vue: "Vue",
  //       paragraph: "Paragraph"
  //     }
  //   },
  //   external: [
  //     'Vue'
  //   ],
  //   plugins: [
  //     commonjs(),
  //     vue(),
  //     resolve()
  //   ]
  // }
]