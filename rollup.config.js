import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    format: 'cjs',
    file: 'dist/component/ContentArchitect.js'
  },
  external: [
    'vue'
  ],
  plugins: [
    vue(),
    commonjs(),
  ]
}