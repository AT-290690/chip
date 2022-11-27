import { link } from './cli.js'
console.log(`
here is the link:
${link('./programms/tree.rs')}


animations are also supported:
${link('./programms/rose.rs')}

user interface:
${link('./programms/counters.rs')}

game of life: 
${link('./programms/gol.rs')}

`)
