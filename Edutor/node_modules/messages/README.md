# Messages

A work in progress. Eventually, a complete framework for localizable messages for all user interfaces.

```js
import msg from 'messages'

msg('foo') === 'foo'
msg`bar` === 'bar'
msg`string ${'baz'}` === 'string baz'

// {0, select, foo{bar} other{qux} }
const selectMsg = msg.select({ foo: 'bar' }, 'qux')
selectMsg('foo') === 'bar'
selectMsg('baz') === 'qux'

// {0, plural, =42{truth} one{one} other{other} }
const pluralMsg = msg.plural({ one: 'one', 42: 'truth', other: 'other' })
pluralMsg(1) === 'one'
pluralMsg(2) === 'other'
pluralMsg(42) === 'truth'

// {0, selectordinal, one{#st} two{#nd} few{#rd} other{#th} }
const ordinalMsg = msg.ordinal({
  one: '#st',
  two: '#nd',
  few: '#rd',
  other: '#th'
})
ordinalMsg(2) === '2nd'
ordinalMsg(21) === '21st'

// {gender, select,
//   male {He} female {She} other {They}
// } found {count, plural,
//   =0 {no results} one {1 result} other {# results}
// }.
const person = msg.select({ male: 'He', female: 'She' }, 'They')
const results = msg.plural({
  0: 'no results',
  one: '1 result',
  other: '# results'
})
const fullMsg = msg`${person(gender)} found ${results(count)}.`
```
