class Map extends Object {
  constructor(param) {
    super()
    // console.log('new Map')
    Object.defineProperty(this, '_data', { value: [] })

    if (param) {
      const iterator = param[Symbol.iterator]
      if (typeof iterator !== 'function') {
        throw(new TypeError(`${typeof iterator} is not a function`))
      }
      for (const item of iterator()) {
        if (typeof item === 'object') {
          this.set(item[0], item[1])
        } else {
          throw(new TypeError(`TypeError: Iterator value ${item} is not an entry object`))
        }
      }
    }

    Object.defineProperty(this, 'size', {
      get() { return this._data.length }
    })

    Object.defineProperty(this, Symbol.iterator, {
      value: function() {
        const self = this
        return {
          ...self._data,
          length: self._data.length,
          index: 0,
          next() {
            return {
              done: this.index === self._data.length,
              value: self._data[this.index++]
            }
          },
          [Symbol.iterator]: function() { return this } 
        }
      }
    })

    Object.defineProperty(this, Symbol.toStringTag, { value: 'Map' })
  }

  set(key, value) {
    const index = this._data.findIndex(item => item[0] === key)
    if (index > -1) {
      this._data.splice(index, 1, [key, value])
    } else {
      this._data.push([key, value])
    }
    return this
  }

  get(key) {
    const result = this._data.find(item => item[0] === key)
    return result ? result[1] : undefined
  }

  delete(key) {
    const index = this._data.findIndex(item => item[0] === key)
    if (index > -1) {
      this._data.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  clear() {
    this._data.splice(0, this._data.length)
  }

  entries() {
    return this[Symbol.iterator]()
  }

  keys() {
    return this[Symbol.iterator].call({
      _data: this._data.map(item => item[0])
    })
  }

  values() {
    return this[Symbol.iterator].call({
      _data: this._data.map(item => item[1])
    })
  }

  forEach(callback) {
    this._data.forEach((item, ...args) => callback(item[1], ...args))
  }

}
