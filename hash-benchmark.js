// from https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e

import Benchmark from 'benchmark';
import { createHash as hash } from 'crypto';

const suite = new Benchmark.Suite;
const data = 'Delightful remarkably mr on announcing themselves entreaties ' +
    'favourable. About to in so terms voice at. Equal an would is found ' +
    'seems of. The particular friendship one sufficient terminated frequently' +
    ' themselves. It more shed went up is roof if loud case. Delay music in' +
    ' lived noise an. Beyond genius really enough passed is up.';

// const scenarios = [
//   { alg: 'md5', digest: 'hex' },
//   { alg: 'md5', digest: 'base64' },
//   { alg: 'sha1', digest: 'hex' },
//   { alg: 'sha1', digest: 'base64' },
//   { alg: 'sha256', digest: 'hex' },
//   { alg: 'sha256', digest: 'base64' }
// ];

const scenariosBase64 = [
// { alg: 'gost-mac', digest: 'base64' },    // fails
// { alg: 'md_gost94', digest: 'base64' },   // fails
  { alg: 'md4', digest: 'base64' },          // 322,801 ops/sec (fastest overall)
  { alg: 'md5', digest: 'base64' },          // 307,333 ops/sec (2nd fastest overall)
  { alg: 'ripemd160', digest: 'base64' },    // 247,305 ops/sec
  { alg: 'sha1', digest: 'base64' },         // 263,606 ops/sec
  { alg: 'sha224', digest: 'base64' },       // 254,582 ops/sec
  { alg: 'sha256', digest: 'base64' },       // 265,566 ops/sec
  { alg: 'sha384', digest: 'base64' },       // 277,804 ops/sec
  { alg: 'sha512', digest: 'base64' },       // 274,444 ops/sec
  { alg: 'whirlpool', digest: 'base64' },    // 171,078 ops/sec
// { alg: 'streebog256', digest: 'base64' }, // fails
// { alg: 'streebog512', digest: 'base64' }, // fails
];

const scenarios = [
  { alg: 'md4', digest: 'hex' },             // 293,950 ops/sec (2nd fastest hex)
  { alg: 'md5', digest: 'hex' },             // 295,323 ops/sec (fastest hex)
  { alg: 'ripemd160', digest: 'hex' },       // 253,371 ops/sec
  { alg: 'sha1', digest: 'hex' },            // 241,319 ops/sec
  { alg: 'sha224', digest: 'hex' },          // 233,507 ops/sec
  { alg: 'sha256', digest: 'hex' },          // 244,951 ops/sec
  { alg: 'sha384', digest: 'hex' },          // 239,686 ops/sec
  { alg: 'sha512', digest: 'hex' },          // 230,932 ops/sec
  { alg: 'whirlpool', digest: 'hex' },       // 180,230 ops/sec
];

for (const { alg, digest } of scenarios) {
  suite.add(`${alg}-${digest}`, () => 
    hash(alg).update(data).digest(digest)
  );
}
suite.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run();
