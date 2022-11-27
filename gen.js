import { link } from './cli.js'
console.log(`
here is the link:
${link('./programms/tree.rs')}

## Web Code Editor:

https://at-290690.github.io/hyper-light/index.html

## Excercises:

https://at-290690.github.io/hyper-light/learn.html

## More examples

animations are also supported:
${link('./programms/rose.rs')}

user interface:
${link('./programms/counters.rs')}

game of life: 
${link('./programms/gol.rs')}

`)
