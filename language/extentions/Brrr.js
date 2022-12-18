export default class Brrr {
  #left = [Brrr.#negativeZeroSymbol]
  #right = []
  get offsetLeft() {
    return (this.#left.length - 1) * -1
  }
  get offsetRight() {
    return this.#right.length
  }
  get length() {
    return this.#left.length + this.#right.length - 1
  }
  set length(n) {
    const len = this.length
    if (n === len) return len
    len > n ? this.removeFrom(n, len - n) : this.addTo(n, undefined)
    return this.length
  }

  get first() {
    return this.get(0)
  }

  get last() {
    return this.get(this.length - 1)
  }

  get items() {
    return _toArrayDeep(this)
  }

  get reflection() {
    return { left: this.#left, right: this.#right }
  }
  get shape() {
    return _toShapeDeep(this)
  }

  with(...initial) {
    if (this.length) this.clear()
    const half = (initial.length / 2) | 0.5
    for (let i = half - 1; i >= 0; i--) this.#addToLeft(initial[i])
    for (let i = half; i < initial.length; ++i) this.#addToRight(initial[i])
    return this
  }
  get(offset) {
    const offsetIndex = offset + this.offsetLeft
    const index = offsetIndex < 0 ? offsetIndex * -1 : offsetIndex
    return offsetIndex >= 0 ? this.#right[index] : this.#left[index]
  }

  set(index, value) {
    const offset = index + this.offsetLeft
    if (offset >= 0) this.#right[offset] = value
    else this.#left[offset * -1] = value
    return this
  }

  clear() {
    this.#left.length = 1
    this.#right.length = 0
    return this
  }

  #addToLeft(item) {
    this.#left.push(item)
  }

  #addToRight(item) {
    this.#right.push(item)
  }

  #removeFromLeft() {
    if (this.length) {
      if (this.length === 1) this.clear()
      else if (this.#left.length > 0) this.#left.length--
    }
  }

  #removeFromRight() {
    if (this.length) {
      if (this.length === 1) this.clear()
      else if (this.#right.length > 0) this.#right.length--
    }
  }

  [Symbol.iterator] = function* () {
    for (let i = 0, len = this.length; i < len; ++i) yield this.get(i)
  }

  do(predicate) {
    predicate(this)
    return this
  }

  isBalanced() {
    return this.offsetRight + this.offsetLeft === 0
  }

  isCompact() {
    return this.every(x => x != undefined)
  }

  isSparce() {
    return this.some(x => x == undefined)
  }

  _isEqual(other) {
    return _isEqual(this, other)
  }

  isShortCircuited() {
    return false
  }

  shortCircuitIf(predicate) {
    return predicate(this) ? _shadow : this
  }

  shortCircuitUnless(predicate) {
    return predicate(this) ? this : _shadow
  }

  balance() {
    if (this.isBalanced()) return this
    const initial = [...this]
    this.clear()
    const half = (initial.length / 2) | 0.5
    for (let i = half - 1; i >= 0; i--) this.#addToLeft(initial[i])
    for (let i = half; i < initial.length; ++i) this.#addToRight(initial[i])
    return this
  }
  static #negativeZeroSymbol = Symbol('-0')

  static of(...items) {
    return Brrr.from(items)
  }

  static isBrrr(entity) {
    return entity instanceof Brrr
  }

  static from(iterable) {
    if (!_isIterable(iterable))
      throw new Error('TypeError: From input is not iterable')
    const out = new Brrr()
    const half = (iterable.length / 2) | 0.5
    for (let i = half - 1; i >= 0; i--) out.#addToLeft(iterable[i])
    for (let i = half; i < iterable.length; ++i) out.#addToRight(iterable[i])
    return out
  }

  static matrix(...dimensions) {
    return _toMatrix(...dimensions)
  }

  static zeroes(size) {
    return Brrr.from(new Array(size).fill(0))
  }

  static ones(size) {
    return Brrr.from(new Array(size).fill(1))
  }

  at(index) {
    if (index < 0) return this.get(this.length + index)
    else return this.get(index)
  }

  push(...items) {
    for (let i = 0; i < items.length; ++i) this.#addToRight(items[i])
    return this.length
  }

  unshift(...items) {
    for (let i = items.length - 1; i >= 0; i--) this.#addToLeft(items[i])
    return this.length
  }

  pop() {
    if (this.offsetRight === 0) this.balance()
    const last = this.last
    this.#removeFromRight()
    return last
  }

  shift() {
    if (this.offsetLeft === 0) this.balance()
    const first = this.first
    this.#removeFromLeft()
    return first
  }
  slice(start, end = this.length) {
    const collection = []
    end = Math.min(end, this.length)
    for (let i = start; i < end; ++i) collection.push(this.get(i))
    return Brrr.from(collection)
  }
  splice(dir, deleteCount, ...items) {
    const start = Math.abs(dir)
    deleteCount = deleteCount ?? this.length - start
    deleteCount = Math.min(deleteCount, this.length - start)
    const deleted = new Brrr()
    if (this.offsetLeft + start > 0) {
      const len = this.length - start - deleteCount
      this.rotateRight(len)
      if (deleteCount > 0)
        for (let i = 0; i < deleteCount; ++i) deleted.push(this.cut())
      dir < 0 ? this.unshift(...items) : this.push(...items)
      for (let i = 0; i < len; ++i) this.append(this.chop())
    } else {
      this.rotateLeft(start)
      if (deleteCount > 0)
        for (let i = 0; i < deleteCount; ++i) deleted.push(this.chop())
      dir < 0 ? this.push(...items) : this.unshift(...items)
      for (let i = 0; i < start; ++i) this.prepend(this.cut())
    }
    return deleted
  }
  indexOf(item) {
    for (let i = 0, len = this.length; i < len; ++i)
      if (this.get(i) === item) return i
    return -1
  }
  lastIndexOf(item) {
    for (let i = this.length - 1; i >= 0; i--)
      if (this.get(i) === item) return i
  }
  includes(val, fromIndex = 0) {
    for (let i = fromIndex, len = this.length; i < len; ++i)
      if (_sameValueZero(this.get(i), val)) return true
    return false
  }
  find(callback = _Identity, startIndex = 0) {
    for (let i = startIndex, len = this.length; i < len; ++i) {
      if (i >= this.length) return
      const current = this.get(i)
      if (callback(current, i, this)) return current
    }
  }
  findLast(callback = _Identity, startIndex = 0) {
    for (let i = this.length - 1 - startIndex; i >= 0; i--) {
      if (i >= this.length) return
      const current = this.get(i)
      if (callback(current, i, this)) return current
    }
  }
  some(callback = _Identity) {
    for (let i = 0, len = this.length; i < len; ++i)
      if (callback(this.get(i), i, this)) return true
    return false
  }
  every(callback = _Identity) {
    for (let i = 0, len = this.length; i < len; ++i)
      if (i >= this.length || !callback(this.get(i), i, this)) return false
    return true
  }

  findIndex(callback = _Identity, startIndex = 0) {
    for (let i = startIndex, len = this.length; i < len; ++i) {
      const current = this.get(i)
      if (callback(current, i, this)) return i
    }
    return -1
  }

  findLastIndex(callback = _Identity, startIndex = 0) {
    for (let i = this.length - 1 - startIndex; i >= 0; i--) {
      const current = this.get(i)
      if (callback(current, i, this)) return i
    }
    return -1
  }
  map(callback) {
    const result = new Brrr()
    const half = (this.length / 2) | 0.5
    for (let i = half - 1; i >= 0; i--)
      result.#addToLeft(callback(this.get(i), i, this))
    for (let i = half, len = this.length; i < len; ++i)
      result.#addToRight(callback(this.get(i), i, this))
    return result
  }
  mapMut(callback) {
    for (let i = 0, len = this.length; i < len; ++i)
      this.set(i, callback(this.get(i), i, this))
    return this
  }
  forEach(callback) {
    for (let i = 0, len = this.length; i < len; ++i)
      callback(this.get(i), i, this)
  }
  reduce(callback, initial = this.get(0)) {
    for (let i = 0, len = this.length; i < len; ++i)
      initial = callback(initial, this.get(i), i, this)
    return initial
  }
  reduceRight(callback, initial = this.at(-1)) {
    for (let i = this.length - 1; i >= 0; i--)
      initial = callback(initial, this.get(i), i, this)
    return initial
  }
  filter(callback = _Identity) {
    const out = []
    for (let i = 0, len = this.length; i < len; ++i) {
      const current = this.get(i)
      const predicat = callback(current, i, this)
      if (predicat) out.push(current)
    }
    return Brrr.from(out)
  }
  reject(callback = _Identity) {
    const out = []
    for (let i = 0, len = this.length; i < len; ++i) {
      const current = this.get(i)
      const predicat = !callback(current, i, this)
      if (predicat) out.push(current)
    }
    return Brrr.from(out)
  }
  reverse() {
    const left = this.#left
    const right = this.#right
    right.unshift(left.shift())
    this.#left = right
    this.#right = left
    return this
  }
  group(callback = _Identity) {
    const out = this.reduce((acc, item, index, arr) => {
      const key = callback(item, index, arr)
      if (acc.has(key)) acc.get(key).append(item)
      else acc.set(key, new Brrr(key).with(item))
      return acc
    }, new _Group())
    out.forEach(item => item.balance())
    return out
  }
  mergeSort(callback = (a, b) => (a < b ? -1 : 1)) {
    return _mergeSort(this, callback)
  }
  quickSort(order) {
    return order === -1
      ? _quickSortDesc(this, 0, this.length - 1)
      : _quickSortAsc(this, 0, this.length - 1)
  }
  join(separator = ',') {
    let output = ''
    for (let i = 0, len = this.length; i < len - 1; ++i)
      output += this.get(i) + separator
    output += this.get(this.length - 1)
    return output
  }

  merge(...arrays) {
    arrays.forEach(array => {
      array.forEach(item => this.append(item))
    })
    return this
  }

  concat(second) {
    return Brrr.from([...this, ...second])
  }
  flat(levels = 1) {
    const flat =
      levels === Infinity
        ? collection => _flatten(collection, levels, flat)
        : (collection, levels) => {
            levels--
            return levels === -1
              ? collection
              : _flatten(collection, levels, flat)
          }
    return Brrr.from(flat(this, levels))
  }

  _flatten(callback) {
    return Brrr.from(
      this.reduce((acc, current, index, self) => {
        if (Brrr.isBrrr(current))
          current.forEach(item => acc.push(callback(item)))
        else acc.push(callback(current, index, self))
        return acc
      }, [])
    )
  }

  addTo(index, value) {
    if (index >= this.length)
      for (let i = this.length; i <= index; ++i) this.#addToRight(undefined)
    const offset = index + this.offsetLeft
    if (offset >= 0) this.#right[offset] = value
    else this.#left[offset * -1] = value
    return this
  }

  addAt(index, ...value) {
    if (this.offsetLeft + index > 0) {
      const len = this.length - index
      this.rotateRight(len)
      this.push(...value)
      for (let i = 0; i < len; ++i) this.append(this.shift())
    } else {
      this.rotateLeft(index)
      this.unshift(...value)
      for (let i = 0; i < index; ++i) this.prepend(this.pop())
    }
    return this
  }

  removeFrom(index, amount) {
    const length = this.length
    if (length - 1 <= index) return this.head()
    const len = length - index
    amount = Math.min(len, amount)
    const isCloserToTheRight = this.offsetLeft + index > 0
    if (isCloserToTheRight) {
      this.rotateRight(len)
      for (let i = 0; i < amount; ++i) this.cut()
      for (let i = 0; i < len; ++i) this.append(this.chop())
    } else {
      this.rotateLeft(index)
      for (let i = 0; i < amount; ++i) this.chop()
      for (let i = 0; i < index; ++i) this.prepend(this.cut())
    }
    return this
  }
  toArray(deep = false) {
    return deep ? _toArrayDeep(this) : [...this]
  }
  toObject(deep = false) {
    return deep ? _toObjectDeep(this) : this.reflection
  }
  async toPromise() {
    return Brrr.from(await Promise.all(this.items))
  }
  append(item) {
    this.#addToRight(item)
    return this
  }
  prepend(item) {
    this.#addToLeft(item)
    return this
  }
  cut() {
    if (this.offsetRight === 0) this.balance()
    const last = this.last
    this.#removeFromRight()
    return last
  }
  chop() {
    if (this.offsetLeft === 0) this.balance()
    const first = this.first
    this.#removeFromLeft()
    return first
  }
  head() {
    if (this.offsetRight === 0) this.balance()
    this.#removeFromRight()
    return this
  }
  tail() {
    if (this.offsetLeft === 0) this.balance()
    this.#removeFromLeft()
    return this
  }
  insertRight(...items) {
    for (let i = 0; i < items.length; ++i) this.#addToRight(items[i])
    return this
  }

  insertLeft(...items) {
    for (let i = items.length - 1; i >= 0; i--) this.#addToLeft(items[i])
    return this
  }
  take(n = 1) {
    const collection = []
    const len = Math.min(n, this.length)
    for (let i = 0; i < len; ++i) collection.push(this.get(i))
    return Brrr.from(collection)
  }
  takeRight(n = 1) {
    const collection = []
    const length = this.length
    const len = Math.min(n, length)
    for (let i = 0; i < len; ++i) collection.push(this.get(length - (len - i)))
    return Brrr.from(collection)
  }
  to(callback, initial = new Brrr()) {
    for (let i = 0, len = this.length; i < len; ++i)
      initial = callback(initial, this.get(i), i, this)
    return initial
  }
  rotateLeft(n = 1) {
    n = n % this.length
    for (let i = 0; i < n; ++i) {
      if (this.offsetLeft === 0) this.balance()
      this.#addToRight(this.first)
      this.#removeFromLeft()
    }
    return this
  }
  rotateRight(n = 1) {
    n = n % this.length
    for (let i = 0; i < n; ++i) {
      if (this.offsetRight === 0) this.balance()
      this.#addToLeft(this.last)
      this.#removeFromRight()
    }
    return this
  }
  rotate(n = 1, direction = 1) {
    return direction === 1 ? this.rotateRight(n) : this.rotateLeft(n)
  }
  without(...excludes) {
    return this.filter(
      item => !excludes.some(exclude => _sameValueZero(item, exclude))
    )
  }
  compact() {
    return this.filter(Boolean)
  }
  union(b) {
    const a = this
    const out = new Brrr()
    const A = new Set(a.toArray())
    const B = new Set(b.toArray())
    A.forEach(item => out.append(item))
    B.forEach(item => out.append(item))
    out.balance()
    return out
  }

  xor(b) {
    const a = this
    const out = new Brrr()
    const A = new Set(a.toArray())
    const B = new Set(b.toArray())
    B.forEach(item => !A.has(item) && out.append(item))
    A.forEach(item => !B.has(item) && out.append(item))
    out.balance()
    return out
  }

  intersection(b) {
    const a = this
    const out = new Brrr()
    const A = new Set(a.toArray())
    const B = new Set(b.toArray())
    B.forEach(item => A.has(item) && out.append(item))
    out.balance()
    return out
  }

  difference(b) {
    const a = this
    const out = new Brrr()
    const A = new Set(a.toArray())
    const B = new Set(b.toArray())
    A.forEach(item => !B.has(item) && out.append(item))
    out.balance()
    return out
  }

  partition(groups = 1) {
    const res = this.reduce((acc, _, index, arr) => {
      if (index % _Groups === 0) {
        const part = new Brrr()
        for (let i = 0; i < groups; ++i) {
          const current = arr.get(index + i)
          if (current !== undefined) part.append(current)
        }
        part.balance()
        acc.append(part)
      }
      return acc
    }, new Brrr())
    res.balance()
    return res
  }

  window(size = this.length) {
    const len = this.length
    const ref = this
    const gen = function* (chunk = ref.slice(0, size)) {
      for (let i = size; i < len * len; ++i) {
        yield chunk
        if (chunk.length >= size) chunk.tail()
        chunk.append(ref.get(i))
      }
    }
    return {
      generator: gen,
      iterable: () => {
        const generator = gen()
        let out = []
        for (let i = 0; i < this.length - size; ++i) {
          const item = generator.next().value
          out.push(item.copy())
        }
        return Brrr.from(out)
      },
      position: index => {
        if (index === 0) return new Brrr()
        const generator = gen(ref.slice(0, size))
        let out
        for (let i = 0; i < index; ++i) out = generator.next()
        return out?.value ?? new Brrr()
      },
    }
  }
  unique() {
    const set = new Set()
    return Brrr.from(
      this.reduce((acc, item) => {
        if (!set.has(item)) {
          set.add(item)
          acc.push(item)
        }
        return acc
      }, [])
    )
  }

  duplicates() {
    const set = new Set()
    const extra = []
    const out = this.reduce((acc, item) => {
      set.has(item) ? acc.push(item) : set.add(item)
      return acc
    }, [])

    out.forEach(item => {
      if (set.has(item)) {
        set.delete(item)
        extra.push(item)
      }
    })
    return Brrr.from(out.concat(extra))
  }

  swap(i1, i2) {
    const temp = this.get(i1)
    this.set(i1, this.get(i2))
    this.set(i2, temp)
    return this
  }

  swapRemoveRight(index) {
    this.set(index, this.cut())
    return this
  }

  swapRemoveLeft(index) {
    this.set(index, this.chop())
    return this
  }

  copy() {
    return Brrr.from([...this])
  }

  scan(callback, dir = 1) {
    if (dir === -1)
      for (let i = this.length - 1; i >= 0; i--) callback(this.get(i), i, this)
    else
      for (let i = 0, len = this.length; i < len; ++i)
        callback(this.get(i), i, this)
    return this
  }

  isEmpty() {
    return this.#left.length + this.#right.length === 1
  }

  isInBounds(index) {
    return index >= 0 && index < this.length
  }

  getInBounds(index) {
    return this.get(_clamp(index, 0, this.length - 1))
  }

  setInBounds(index, value) {
    return this.set(_clamp(index, 0, this.length - 1), value)
  }

  getInWrap(index) {
    return this.get(index % this.length)
  }

  setInWrap(index, value) {
    return this.set(index % this.length, value)
  }

  isSorted(order = 1) {
    return this.every(
      typeof order === 'function'
        ? order
        : order === 1
        ? (current, index, arr) => !index || arr.at(index - 1) <= current
        : (current, index, arr) => !index || arr.at(index - 1) >= current
    )
  }
  search(target, _Identity = _Identity, greather) {
    return _binarySearch(
      this,
      target,
      _Identity,
      greather ?? (current => _Identity(current) > target),
      0,
      this.length
    )
  }
}
const _sameValueZero = (x, y) => x === y || (Number.isNaN(x) && Number.isNaN(y))
const _clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const _isIterable = iter =>
  iter === null || iter === undefined
    ? false
    : typeof iter[Symbol.iterator] === 'function'

const _tailCallOptimisedRecursion =
  func =>
  (...args) => {
    let result = func(...args)
    while (typeof result === 'function') result = result()
    return result
  }

const _flatten = (collection, levels, flat) =>
  collection.reduce((acc, current) => {
    if (Brrr.isBrrr(current)) acc.push(...flat(current, levels))
    else acc.push(current)
    return acc
  }, [])

const _toMatrix = (...args) => {
  if (args.length === 0) return
  const dimensions = new Brrr().with(...args)
  const dim = dimensions.chop()
  const arr = new Brrr()
  for (let i = 0; i < dim; ++i) arr.set(i, _toMatrix(...dimensions))
  return arr
}

const _toArrayDeep = entity => {
  return Brrr.isBrrr(entity)
    ? entity
        .map(item =>
          Brrr.isBrrr(item)
            ? item.some(Brrr.isBrrr)
              ? _toArrayDeep(item)
              : item.toArray()
            : item
        )
        .toArray()
    : entity
}

const _toObjectDeep = entity => {
  return Brrr.isBrrr(entity)
    ? entity
        .map(item =>
          Brrr.isBrrr(item)
            ? item.some(Brrr.isBrrr)
              ? _toObjectDeep(item)
              : item.toObject()
            : item
        )
        .toObject()
    : entity
}
const _toShapeDeep = (entity, out = []) => {
  if (Brrr.isBrrr(entity.get(0))) {
    entity.forEach(item => {
      out.push(_toShapeDeep(item))
    })
  } else {
    out = [entity.length]
  }
  return out
}

const _quickSortAsc = (items, left, right) => {
  if (items.length > 1) {
    let pivot = items.get(((right + left) / 2) | 0.5),
      i = left,
      j = right
    while (i <= j) {
      while (items.get(i) < pivot) ++i
      while (items.get(j) > pivot) j--
      if (i <= j) {
        items.swap(i, j)
        ++i
        j--
      }
    }
    if (left < i - 1) _quickSortAsc(items, left, i - 1)
    if (i < right) _quickSortAsc(items, i, right)
  }
  return items
}

const _quickSortDesc = (items, left, right) => {
  if (items.length > 1) {
    let pivot = items.get(((right + left) / 2) | 0.5),
      i = left,
      j = right
    while (i <= j) {
      while (items.get(i) > pivot) ++i
      while (items.get(j) < pivot) j--
      if (i <= j) {
        items.swap(i, j)
        ++i
        j--
      }
    }
    if (left < i - 1) _quickSortDesc(items, left, i - 1)
    if (i < right) _quickSortDesc(items, i, right)
  }
  return items
}

const merge = (left, right, callback) => {
  const arr = []
  while (left.length && right.length) {
    callback(right.at(0), left.at(0)) > 0
      ? arr.push(left.chop())
      : arr.push(right.chop())
  }

  for (let i = 0; i < left.length; ++i) {
    arr.push(left.get(i))
  }
  for (let i = 0; i < right.length; ++i) {
    arr.push(right.get(i))
  }
  const out = new Brrr()
  const half = (arr.length / 2) | 0.5
  for (let i = half - 1; i >= 0; i--) out.prepend(arr[i])
  for (let i = half; i < arr.length; ++i) out.append(arr[i])
  return out
}

const _mergeSort = (array, callback) => {
  const half = (array.length / 2) | 0.5
  if (array.length < 2) {
    return array
  }
  const left = array.splice(0, half)
  return merge(_mergeSort(left, callback), _mergeSort(array, callback), callback)
}

const _binarySearch = _tailCallOptimisedRecursion(
  (arr, target, by, greather, start, end) => {
    if (start > end) return undefined
    const index = ((start + end) / 2) | 0.5
    const current = arr.get(index)
    if (current === undefined) return undefined
    const _Identity = by(current)
    if (_Identity === target) return current
    if (greather(current))
      return _binarySearch(arr, target, by, greather, start, index - 1)
    else return _binarySearch(arr, target, by, greather, index + 1, end)
  }
)
const _Identity = current => current
class _Group {
  constructor() {
    this.items = {}
  }
  get(key) {
    return this.items[key]
  }
  set(key, value) {
    this.items[key] = value
    return this
  }
  get values() {
    return Object.values(this.items)
  }
  get keys() {
    return Object.keys(this.items)
  }
  has(key) {
    return key in this.items
  }
  forEntries(callback) {
    for (let key in this.items) {
      callback([key, this.items[key]], this.items)
    }
    return this
  }
  forEach(callback) {
    for (let key in this.items) {
      callback(this.items[key], key)
    }
    return this
  }
  map(callback) {
    for (let key in this.items) {
      this.items[key] = callback(this.items[key], key, this.items)
    }
    return this
  }
}

const _isEqual = (a, b) => {
  if (a === b) return true
  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false
    let length, i, keys
    if (Brrr.isBrrr(a) && Brrr.isBrrr(b)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; )
        if (!_isEqual(a.get(i), b.get(i))) return false
      return true
    }
    if (Array.isArray(a)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) if (!_isEqual(a[i], b[i])) return false
      return true
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false
      for (i of a.entries()) if (!b.has(i[0])) return false
      for (i of a.entries()) if (!_isEqual(i[1], b.get(i[0]))) return false
      return true
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false
      for (i of a.entries()) if (!b.has(i[0])) return false
      return true
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; ) if (a[i] !== b[i]) return false
      return true
    }
    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf()
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString()
    keys = Object.keys(a)
    length = keys.length
    if (length !== Object.keys(b).length) return false
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false
    for (i = length; i-- !== 0; ) {
      let key = keys[i]
      if (!_isEqual(a[key], b[key])) return false
    }
    return true
  }
  // true if both NaN, false otherwise
  return a !== a && b !== b
}

class _Shadow {
  isShortCircuited() {
    return true
  }
}
for (const method of Brrr.from([
  ...Object.getOwnPropertyNames(Brrr),
  ...Object.getOwnPropertyNames(Brrr.prototype),
]).without('prototype', 'isShortCircuited', 'constructor').items) {
  _Shadow.prototype[method] = () => _Shadow
}
const _shadow = Object.freeze(new _Shadow())
