import { VOID } from '../core/tokens.js'

export const protolessModule = methods => {
  const env = Object.create(null)
  for (const method in methods) env[method] = methods[method]
  return env
}

export const LIBRARY = {
  NAME: 'LIBRARY',
  HTTP: {
    NAME: 'HTTP',
    getrequestmanyjson: (callback, ...promises) =>
      Promise.all(promises).then(res =>
        Promise.all(res.map(r => r.json()).then(callback))
      ),
    getrequestsinglejson: (url, callback) =>
      fetch(url)
        .then(data => data.json())
        .then(callback),
    getrequestsingletext: (url, callback) =>
      fetch(url)
        .then(data => data.text())
        .then(callback),
  },
  STORAGE: {
    NAME: 'STORAGE',
    setinstorage: (key, value) => sessionStorage.setItem(key, value),
    getfromstorage: key => sessionStorage.getItem(key),
    removefromstorage: key => sessionStorage.removeItem(key),
    clearstorage: () => sessionStorage.clear(),
  },
  DATE: {
    NAME: 'DATE',
    formattolocal: (date, format) => date.toLocaleDateString(format),
    makenewdate: () => new Date(),
    makedate: date => new Date(date),
    gethours: date => date.getHours(),
    getminutes: date => date.getMinutes(),
    getseconds: date => date.getSeconds(),
    gettime: date => date.getTime(),
  },
  COLOR: {
    NAME: 'COLOR',
    makergbcolor: (r, g, b) => `rgb(${r}, ${g}, ${b})`,
    makergbalphacolor: (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`,
    randomcolor: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    randomlightcolor: () =>
      '#' +
      (
        '00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
      ).slice(-6),
    rgbtohex: color => {
      const [r, g, b] = color.split('(')[1].split(')')[0].split(',').map(Number)
      function componentToHex(c) {
        var hex = c.toString(16)
        return hex.length == 1 ? '0' + hex : hex
      }
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
    },
    inverthexcolor: hex =>
      '#' +
      (Number(`0x1${hex.split('#')[1]}`) ^ 0xffffff)
        .toString(16)
        .substring(1)
        .toUpperCase(),
  },
  OBJECT: {
    NAME: 'OBJECT',
    forin: (object, callback) => {
      for (const key in object) callback(key, object)
      return object
    },
    forof: (object, callback) => {
      for (const key in object) callback(object[key])
      return object
    },
    jsonstring: object => JSON.stringify(object),
    jsonparse: string => JSON.parse(string),
    clone: obj => structuredClone(obj),
    has: (obj, ...props) => +props.every(x => x in obj),
    keys: obj => Object.keys(obj),
    values: obj => Object.values(obj),
    entries: obj => Object.entries(obj),
    fromentries: entries => Object.fromEntries(entries),
    freeze: obj => {
      void Object.freeze(obj)
      return obj
    },
    size: obj => Object.keys(obj).length,
  },
  BITWISE: {
    NAME: 'BITWISE',
    and: (a, b) => a & b,
    not: a => ~a,
    or: (a, b) => a | b,
    xor: (a, b) => a ^ b,
    leftshift: (a, b) => a << b,
    rightshift: (a, b) => a >> b,
    unrightshift: (a, b) => a >>> b,
  },
  MATH: {
    NAME: 'MATH',
    lerp: (start, end, amt) => (1 - amt) * start + amt * end,
    abs: num => Math.abs(num),
    mod: (left, right) => ((left % right) + right) % right,
    clamp: (num, min, max) => Math.min(Math.max(num, min), max),
    sqrt: num => Math.sqrt(num),
    inc: (a, i = 1) => (a += i),
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mult: (a, b) => a * b,
    pow: (a, b) => a ** b,
    pow2: a => a ** 2,
    divide: (a, b) => a / b,
    sign: n => Math.sign(n),
    trunc: n => Math.trunc(n),
    exp: n => Math.exp(n),
    floor: n => Math.floor(n),
    round: n => Math.round(n),
    random: () => Math.random(),
    randomint: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    max: (...args) => Math.max(...args),
    min: (...args) => Math.min(...args),
    sin: n => Math.sin(n),
    cos: n => Math.cos(n),
    tan: n => Math.tan(n),
    tanh: n => Math.tanh(n),
    atan: n => Math.atan(n),
    atanh: n => Math.atanh(n),
    atan2: (y, x) => Math.atan2(y, x),
    acos: n => {
      n = Math.acos(n)
      return isNaN(n) ? VOID : n
    },
    acosh: n => {
      n = Math.acosh(n)
      return isNaN(n) ? VOID : n
    },
    asin: n => {
      n = Math.asin(n)
      return isNaN(n) ? VOID : n
    },
    asinh: n => Math.asinh(n),
    atanh: n => {
      n = Math.atanh(n)
      return isNaN(n) ? VOID : n
    },
    hypot: (x, y) => Math.hypot(x, y),
    fround: n => Math.fround(n),
    log10: x => Math.log10(x),
    log2: x => Math.log2(x),
    log: x => Math.log(x),
    sum: arr => arr.reduce((acc, item) => (acc += item), 0),
    MININT: Number.MIN_SAFE_INTEGER,
    MAXINT: Number.MAX_SAFE_INTEGER,
    infinity: Number.POSITIVE_INFINITY,
    negative: n => -n,
    PI: Math.PI,
    E: Math.E,
    LN10: Math.LN10,
    LOG10E: Math.LOG10E,
    SQRT1_2: Math.SQRT1_2,
    SQRT2: Math.SQRT2,
    parseint: (number, base) => parseInt(number.toString(), base),
    number: string => Number(string),
  },
  STRING: {
    NAME: 'STRING',
    fromcharcode: code => String.fromCharCode(code),
    interpolate: (...args) => {
      return args.reduce((acc, item) => {
        return (acc += item.toString())
      }, '')
    },
    includes: (string, target) => string.includes(target),
    string: thing => thing.toString(),
    uppercase: string => string.toUpperCase(),
    lowercase: string => string.toLowerCase(),
    trim: string => string.trim(),
    trimstart: string => string.trimStart(),
    trimend: string => string.trimEnd(),
    substring: (string, start, end) =>
      string.substring(start, end ?? end.length),
    replace: (string, match, replace) => string.replace(match, replace),
    replaceall: (string, match, replace) => string.replaceAll(match, replace),
    sp: ' ',
  },
  CONVERT: {
    NAME: 'CONVERT',
    array: thing => [...thing],
    boolean: thing => Boolean(thing),
    string: thing => thing.toString(),
    integer: number => parseInt(number.toString()),
    float: (number, base = 1) => +Number(number).toFixed(base),
    number: thing => Number(thing),
    cast: (value, type) => {
      if (type === '1')
        return typeof value === 'object'
          ? Object.keys(value).length
          : Number(value)
      else if (type === '')
        return typeof value === 'object' ? JSON.stringify(value) : String(value)
      else if (value === null || value === undefined) return VOID
      else if (type === '.:') {
        if (Array.isArray(value)) return value
        else if (typeof value === 'string') return [...value]
        else if (typeof value === 'number')
          return [...String(value)].map(Number)
        else if (typeof value === 'object') return Object.entries(value)
      } else if (type === '::') {
        if (typeof value === 'string' || Array.isArray(value))
          return { ...value }
        else if (typeof value === 'number') {
          const out = { ...String(value) }
          for (const key in out) {
            out[key] = Number(out[key])
          }
          return out
        } else if (typeof value === 'object') return value
      } else return VOID
    },
  },
  CONSOLE: {
    consolelog: thing => console.log(thing),
    NAME: 'CONSOLE',
  },
  LOGIC: {
    NAME: 'LOGIC',
    istrue: bol => +(!!bol === true),
    isfalse: bol => +(!!bol === false),
    isequal: (a, b) => {
      const typeA = typeof a,
        typeB = typeof b
      if (typeA !== typeB) return 0
      if (typeA === 'number' || typeA === 'string' || typeA === 'boolean')
        return +(a === b)
      if (typeA === 'object') {
        const isArrayA = Array.isArray(a),
          isArrayB = Array.isArray(b)
        if (isArrayA !== isArrayB) return 0
        if (isArrayA && isArrayB) {
          if (a.length !== b.length) return 0
          return +a.every((item, index) =>
            LIBRARY.LOGIC.isequal(item, b[index])
          )
        } else {
          if (a === undefined || a === null || b === undefined || b === null)
            return +(a === b)
          if (Object.keys(a).length !== Object.keys(b).length) return 0
          for (const key in a)
            if (!LIBRARY.LOGIC.isequal(a[key], b[key])) return 0
          return 1
        }
      }
    },
    issimilar: (a, b) => {
      const typeA = typeof a,
        typeB = typeof b
      if (typeA !== typeB) return 0
      if (typeA === 'number' || typeA === 'string' || typeA === 'boolean') {
        return +(a === b)
      }
      if (typeA === 'object') {
        const isArrayA = Array.isArray(a),
          isArrayB = Array.isArray(b)
        if (isArrayA !== isArrayB) return 0
        if (isArrayA && isArrayB) {
          return a.length < b.length
            ? +a.every((item, index) => LIBRARY.LOGIC.issimilar(item, b[index]))
            : +b.every((item, index) => LIBRARY.LOGIC.issimilar(item, a[index]))
        } else {
          if (a === undefined || a === null || b === undefined || b === null)
            return +(a === b)
          const less = Object.keys(a) > Object.keys(b) ? b : a
          for (const key in less) {
            if (!LIBRARY.LOGIC.issimilar(a[key], b[key])) {
              return 0
            }
          }
          return 1
        }
      }
    },
    isnotvoid: item => (item === VOID ? 0 : 1),
    isvoid: item => (item === VOID ? 1 : 0),
    makeboolean: item => Boolean(item),
    and: (entity, other) => entity && other,
    or: (entity, other) => entity || other,
    isempty: item => (Object.keys(item).length === 0 ? 1 : 0),
    TRUE: 1,
    FALSE: 0,
    iseven: arg => (arg % 2 === 0 ? 1 : 0),
    isodd: arg => (arg % 2 !== 0 ? 1 : 0),
    invert: val => +!val,
    ishaving: (obj, ...props) => +props.every(x => x in obj),
    areequal: (item, ...args) =>
      +args.every(current => LIBRARY.LOGIC.isequal(item, current)),
    isoftype: (entity, type) =>
      entity.constructor.name.toUpperCase() === type.toUpperCase(),
  },
  LOOP: {
    NAME: 'LOOP',
    generator: (entity = [], index = 0) => {
      return function* () {
        while (true) {
          yield entity[index++]
        }
      }
    },
    counter: (index = 0) => {
      return function* () {
        while (true) {
          yield index++
        }
      }
    },
    next: entity => {
      return entity.next().value
    },
    iterate: (iterable, callback) => {
      for (const i in iterable) {
        callback(i, iterable)
      }
      return iterable
    },
    inside: (iterable, callback) => {
      for (const i in iterable) {
        callback(i)
      }
      return iterable
    },
    forofevery: (iterable, callback) => {
      for (const x of iterable) {
        callback(x)
      }
      return iterable
    },
    routine: (entity, times, callback) => {
      let out = VOID
      for (let i = 0; i < times; ++i) out = callback(entity, i)
      return out
    },
    loop: (start, end, callback) => {
      for (let i = start; i < end; ++i) callback(i)
    },
    whiletrue: (condition, callback) => {
      let out = VOID
      while (condition()) out = callback()
      return out
    },
    repeat: (times, callback) => {
      let out = VOID
      for (let i = 0; i < times; ++i) out = callback(i)
      return out
    },
    tailcalloptimisedrecursion:
      func =>
      (...args) => {
        let result = func(...args)
        while (typeof result === 'function') result = result()
        return result
      },
  },
  LIST: {
    reverse: list => {
      let head = list // set a reference to head of linked list
      if (head['=>'][0] === VOID) return

      let currentNode = head
      let prevNode = VOID
      let nextNode = VOID

      // traverse list and adjust links
      while (currentNode) {
        nextNode = currentNode['=>'][0]
        currentNode['=>'][0] = prevNode
        prevNode = currentNode
        currentNode = nextNode
        nextNode = VOID
      }
      head = prevNode
      return head
    },
  },
  DOUBLELIST: {
    NAME: 'DOUBLELIST',
    makedoublelist: size => LIBRARY.DOUBLELIST.range(0)(size),
    node: prev => next => ({ '<-': prev, '->': next }),
    prev: n => n['<-'],
    next: n => n['->'],
    range: low => high =>
      low > high
        ? VOID
        : LIBRARY.DOUBLELIST.node(low)(LIBRARY.DOUBLELIST.range(low + 1)(high)),
    map: f => n =>
      n === VOID
        ? VOID
        : LIBRARY.DOUBLELIST.node(f(LIBRARY.DOUBLELIST.prev(n)))(
            LIBRARY.DOUBLELIST.map(f)(LIBRARY.DOUBLELIST.next(n))
          ),
    listtoarray: node => {
      const result = []
      while (node !== VOID) {
        result.push(LIBRARY.DOUBLELIST.prev(node))
        node = LIBRARY.DOUBLELIST.next(node)
      }
      return result
    },
    arraytolist: arrayLike => {
      let result = VOID
      const array = Array.from(arrayLike)
      for (let i = array.length; i >= 0; i--) {
        result = LIBRARY.DOUBLELIST.node(array[i])(result)
      }
      return result
    },
  },
  ARRAY: {
    NAME: 'ARRAY',
    compact: arr => {
      return arr.filter(Boolean)
    },
    makearray: (...items) => {
      return items
    },
    makematrix: (...dimensions) => {
      if (dimensions.length > 0) {
        const dim = dimensions[0]
        const rest = dimensions.slice(1)
        const arr = []
        for (let i = 0; i < dim; ++i) arr[i] = LIBRARY.ARRAY.makematrix(...rest)
        return arr
      } else return VOID
    },
    unique: entity => {
      const set = new Set()
      return entity.reduce((acc, item) => {
        if (!set.has(item)) {
          set.add(item)
          acc.push(item)
        }
        return acc
      }, [])
    },
    indexediteration: (entity, fn) => entity.forEach((x, i, arr) => fn(i)),
    forof: (entity, fn) => entity.forEach((x, i, arr) => fn(x)),
    each: (entity, fn) => entity.forEach((x, i, arr) => fn(x, i)),
    from: items => Array.from(items),
    transform: (entity, callback) => {
      for (let i = 0; i < entity.length; ++i)
        entity[i] = callback(entity[i], i, entity)
      return entity
    },
    tail: entity => {
      entity.shift()
      return entity
    },
    head: entity => {
      entity.pop()
      return entity
    },
    map: (entity, callback) => entity.map(callback),
    filter: (entity, callback) => entity.filter(callback),
    reduce: (entity, callback, out) => entity.reduce(callback, out),
    every: (entity, callback) => +entity.every(callback),
    some: (entity, callback) => +entity.some(callback),
    find: (entity, callback) => entity.find(callback),
    foreach: (entity, callback) => entity.forEach(callback),
    reverse: entity => entity.reverse(),
    insertatend: (entity, ...args) => {
      entity.push(...args)
      return entity
    },
    removefromend: entity => {
      entity.pop()
      return entity
    },
    put: (entity, item) => {
      entity.push(item)
      return item
    },
    append: (entity, item) => {
      entity.push(item)
      return entity
    },
    tail: entity => {
      entity.pop()
      return entity
    },
    head: entity => {
      entity.shift()
      return entity
    },
    includes: (entity, arg) => +entity.includes(arg),
    isarray: entity => +Array.isArray(entity),
    fill: (entity, filling) => entity.fill(filling),
    findindex: (entity, callback) => entity.findIndex(callback),
    indexof: (entity, item) => entity.indexOf(item),
    splitnewline: str => str.split('\n'),
    splitspaces: str => str.split(' '),
    split: (str, separator) => str.split(separator),
    join: (entity, separator) => entity.join(separator),
    flat: (entity, level) => entity.flat(level),
    flatMap: (entity, callback) => entity.flatMap(callback),
    sort: (entity, callback) => entity.sort(callback),
    slice: (entity, start, end) => entity.slice(start, end),
    splice: (entity, ...args) => entity.splice(...args),
    partition: (entity, groups = 1) => {
      return entity.reduce((acc, _, index, arr) => {
        if (index % groups === 0) {
          const part = []
          for (let i = 0; i < groups; ++i) {
            const current = arr[index + i]
            if (current !== undefined) part.push(current)
          }
          acc.push(part)
        }
        return acc
      }, [])
    },
    shuffle: array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },
    zeroes: size => new Array(size).fill(0),
    ones: size => new Array(size).fill(1),
    range: (start, end, step = 1) => {
      const arr = []
      if (start > end) for (let i = start; i >= end; i -= 1) arr.push(i * step)
      else for (let i = start; i <= end; i += 1) arr.push(i * step)
      return arr
    },
    at: (entity, index) => entity.at(index),
    first: entity => entity[0],
    last: entity => entity[entity.length - 1],
  },
  DOM: {
    NAME: 'DOM',
    getbody: () => document.body,
    getparentnode: element => element.parentNode,
    getelementbyid: id => document.getElementById(id),
    getelementsbyclassname: tag => document.getElementsByClassName(tag),
    getelementsbytagname: tag => document.getElementsByTagName(tag),
    makeuserinterface: () => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      return div
    },
    makeimage: src => {
      const img = document.createElement('img')
      img.src = src
      return img
    },
    makeiframe: src => {
      const element = document.createElement('iframe')
      element.setAttribute('src', src)
      return element
    },
    makeelement: (type, settings) => {
      const element = document.createElement(type)
      for (const setting in settings) {
        element.setAttribute(setting, settings[setting])
      }
      return element
    },
    makeinput: settings => {
      const element = document.createElement('input')
      for (const setting in settings) {
        element.setAttribute(setting, settings[setting])
      }
      return element
    },
    maketextarea: settings => {
      const element = document.createElement('textarea')
      for (const setting in settings) {
        element.setAttribute(setting, settings[setting])
      }
      return element
    },
    makecheckbox: () => {
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      return checkbox
    },
    makeslider: settings => {
      const element = document.createElement('input')
      element.type = 'range'

      for (const setting in settings) {
        element.setAttribute(setting, settings[setting])
      }
      return element
    },
    copyfromelement: copyElement => {
      copyElement.select()
      copyElement.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyElement.value)
    },
    copyfromtext: val => {
      navigator.clipboard.writeText(val)
    },
    maketooltip: defaultLabel => {
      const tooltip = document.createElement('span')
      tooltip.textContent = defaultLabel
      return tooltip
    },
    maketable: content => {
      const table = document.createElement('table')
      table.innerHTML = content
      return table
    },
    maketablerow: content => {
      const table = document.createElement('tr')
      table.innerHTML = content
      return table
    },
    maketabledata: content => {
      const table = document.createElement('td')
      table.innerHTML = content
      return table
    },
    maketableheader: content => {
      const table = document.createElement('th')
      table.innerHTML = content
      return table
    },
    maketablecaption: content => {
      const table = document.createElement('caption')
      table.innerHTML = content
      return table
    },
    maketablecolumn: content => {
      const table = document.createElement('col')
      table.innerHTML = content
      return table
    },
    maketablecolumngroup: content => {
      const table = document.createElement('colgroup')
      table.innerHTML = content
      return table
    },
    maketablehead: content => {
      const table = document.createElement('thead')
      table.innerHTML = content
      return table
    },
    maketablebody: content => {
      const table = document.createElement('tbody')
      table.innerHTML = content
      return table
    },
    maketablefooter: content => {
      const table = document.createElement('tfoot')
      table.innerHTML = content
      return table
    },
    makebutton: () => {
      const element = document.createElement('button')
      return element
    },
    makelabel: (element, label) => {
      element.textContent = label
      return element
    },
    makeheader: (content, n = 1) => {
      const element = document.createElement('h' + n)
      element.textContent = content
      return element
    },
    makelist: content => {
      const element = document.createElement('li')
      element.appendChild(content)
      return element
    },
    makecsslink: href => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.crossorigin = 'anonymous'
      document.head.appendChild(link)
      return link
    },
    makeorderedlist: (...lists) => {
      const element = document.createElement('ol')
      lists.forEach(l => element.appendChild(l))
      return element
    },
    makeunorderedlist: (...lists) => {
      const element = document.createElement('ul')
      lists.forEach(l => element.appendChild(l))
      return element
    },
    makeanchor: (content, href) => {
      const element = document.createElement('a')
      element.href = href
      element.textContent = content
      return element
    },
    makepre: content => {
      const element = document.createElement('pre')
      element.textContent = content
      return element
    },
    makeparagraph: content => {
      const element = document.createElement('p')
      element.textContent = content
      return element
    },
    makespan: content => {
      const element = document.createElement('span')
      element.textContent = content
      return element
    },
    setid: (element, id) => {
      element.setAttribute('id', id)
      return element
    },
    maketablefrom: tableData => {
      const table = document.createElement('table')
      const tableBody = document.createElement('tbody')
      tableData.forEach(rowData => {
        const row = document.createElement('tr')
        rowData.forEach(cellData => {
          const cell = document.createElement('td')
          cell.appendChild(document.createTextNode(cellData))
          row.appendChild(cell)
        })
        tableBody.appendChild(row)
      })
      table.appendChild(tableBody)
      return table
    },
    getid: element => element.getattribute('id'),
    getattribute: (element, key) => element.getattribute(key),
    setattribute: (element, key, value) => {
      element.setAttribute(key, value)
      return element
    },
    settextcontent: (element, content) => {
      element.textContent = content
      return element
    },
    setstyle: (element, ...styles) => {
      element.style = styles.join('')
      return element
    },
    makecontainer: (...elements) => {
      const div = document.createElement('div')
      elements.forEach(element => div.appendChild(element))
      document.body.appendChild(div)
      return div
    },
    makeitalictext: content => {
      const element = document.createElement('i')
      element.textContent = content
      return element
    },
    insertintocontainer: (container, ...elements) => {
      elements.forEach(element => container.appendChild(element))
      return container
    },
    removeselffromcontainer: (...elements) =>
      elements.forEach(element => element.parentNode.removeChild(element)),
  },
  STYLE: {
    NAME: 'STYLE',
    makestyle: (...styles) => {
      const element = document.createElement('style')
      element.innerHTML = styles.reduce((acc, [selector, ...style]) => {
        acc += `${selector}{${style.join(';')}}`
        return acc
      }, '')
      document.body.appendChild(element)
      return element
    },
    addclass: (element, ...classlist) => {
      classlist.forEach(cls => element.classList.add(cls))
      return element
    },
    noborder: () => 'border: none;',
    borderradius: value => `border-radius: ${value};`,
    setbounds: value => ({
      top: value,
      left: value,
      right: value,
      bottom: value,
    }),
    border: options =>
      `border: ${options.size ?? ''} ${options.type ?? ''} ${
        options.color ?? ''
      };`.trim(),
    margin: options =>
      `margin: ${options.top ?? '0'} ${options.right ?? '0'} ${
        options.bottom ?? '0'
      } ${options.left ?? '0'};`,
    padding: options =>
      `padding: ${options.top ?? '0'} ${options.right ?? '0'} ${
        options.bottom ?? '0'
      } ${options.left ?? '0'};`,
    display: display =>
      `display: ${
        { f: 'flex', g: 'grid', i: 'inline', b: 'block', ib: 'inline-block' }[
          display
        ]
      };`,
    unitspercent: value => `${value}%`,
    unitspixel: value => `${value}px`,
    unitspoint: value => `${value}pt`,
    backgroundcolor: color => `background-color: ${color};`,
    resetcss: () => {
      const element = document.createElement('style')
      element.innerHTML = `html, body, div, span, applet, object, iframe,
   h1, h2, h3, h4, h5, h6, p, blockquote, pre,
   a, abbr, acronym, address, big, cite, code,
   del, dfn, em, img, ins, kbd, q, s, samp,
   small, strike, strong, sub, sup, tt, var,
   b, u, i, center,
   dl, dt, dd, ol, ul, li,
   fieldset, form, label, legend,
   table, caption, tbody, tfoot, thead, tr, th, td,
   article, aside, canvas, details, embed, 
   figure, figcaption, footer, header, hgroup, 
   menu, nav, output, ruby, section, summary,
   time, mark, audio, video {
     margin: 0;
     padding: 0;
     border: 0;
     font-size: 100%;
     font: inherit;
     vertical-align: baseline;
   }
   /* HTML5 display-role reset for older browsers */
   article, aside, details, figcaption, figure, 
   footer, header, hgroup, menu, nav, section {
     display: block;
   }
   body {
     line-height: 1;
   }
   ol, ul {
     list-style: none;
   }
   blockquote, q {
     quotes: none;
   }
   blockquote:before, blockquote:after,
   q:before, q:after {
     content: '';
     content: none;
   }
   table {
     border-collapse: collapse;
     border-spacing: 0;
   }
   a {
    color: blue;
    text-decoration: none; /* no underline */
  }
   `
      document.body.appendChild(element)
      return element
    },
    cursorpointer: () => 'cursor: pointer;',
    fontfamily: font => `font-family: ${font};`,
    fontsize: size => `font-size: ${size};`,
    displayshow: element => {
      element.style.display = 'block'
      return element
    },
    displayhide: element => {
      element.style.display = 'none'
      return element
    },
    textcolor: color => `color:${color};`,
    textalign: (align = 'c') =>
      `text-align:${{ c: 'center', l: 'left', r: 'right' }[align]};`,
    makeclass: (name, attr) => {
      let out = ''
      for (const a in attr) {
        out += `${a}: ${attr[a]};`
      }
      return `.${name} {\n${out}\n}`
    },
    makesvgstyle: (entity, props) => {
      for (const prop in props) {
        entity.renderer.elem.style[prop] = props[prop]
      }
      return entity.renderer.elem
    },
    styleoption: attr => {
      let out = ''
      for (const a in attr) out += `${a}: ${attr[a]};`
      return out
    },
  },
  EVENT: {
    NAME: 'EVENT',
    oninputchange: (element, callback) => {
      element.addEventListener('change', e => callback(e.target))
      return element
    },
    onmouseclick: (element, callback) => {
      element.addEventListener('click', e => callback(e.target))
      return element
    },
    onmouseover: (element, callback) => {
      element.addEventListener('mouseover', e => callback(e.target))
      return element
    },
    onkeydown: (element, callback) => {
      element.addEventListener('keydown', e => callback(e.key))
      return element
    },
    onkeyup: (element, callback) => {
      element.addEventListener('keyup', e => callback(e.key))
      return element
    },
  },
  void: VOID,
  VOID,
}

export const STD = {
  void: VOID,
  VOID,
  _: VOID,
  printout: (...args) => console.log(...args),
  // IMP: module => {
  //   console.log(
  //     `<- [${Object.keys(module)
  //       .filter(x => x !== 'NAME')
  //       .map(x => `"${x}"`)
  //       .join(';')}] [${module.NAME}];\n`
  //   )
  // },
  call: (x, callback) => callback(x),
  tco:
    func =>
    (...args) => {
      let result = func(...args)
      while (typeof result === 'function') result = result()
      return result
    },
  LIBRARY,
}
