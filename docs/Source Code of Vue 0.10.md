1. general flow?

in mian.js, init ViewModel

ViewModel defines public methods($set/$get/\$watch...) and `new Compiler(this, options)`

a lot of logic is in compiler.js, this file is very important!

(v0.10 does not split watch logic to watcher.js)
