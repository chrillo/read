// allows to iterate over an array of items
// executes each item in the context of a function which returns a promise
// allows for concurrent execution
// does not garantuee order of execution due to concurrency
// rejects if any of the "child" promises rejects
export const promiseMap = async (items, fn, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!items || items.length < 1) {
        return resolve([]);
      }
  
      let concurrency = options.concurrency || 1;
      let stack = items;
      let pending = 0;
      let results = [];
      let rejected = false;

      const next = async () => {
        if (!stack.length || pending >= concurrency) return;
        pending++;
        let item = stack.pop();
        let index = stack.length
        try {
          let result = await fn(item);
          results[index] = result
          pending--;
        } catch (e) {
          rejected = true;
          console.log(e);
          return reject(e);
        }
        if (rejected) return;
        if (stack.length === 0 && pending === 0) {
          resolve(results);
        } else {
          next();
        }
      };
      for (let i = 0; i < concurrency; i++) {
        next();
      }
    });
  };
  
  // extends promiseMap, it allows to processes batches of items instead of
  // one item after the other, useful for external apis that accept batch operations
  export const promiseSliceMap = async (items, fn, options) => {
    let slice = options.slice || 100;
    let sliceCount = items.length / slice;
    let slices = [];
  
    for (let i = 0; i < sliceCount; i++) {
      slices.push(items.splice(0, slice));
    }
    return promiseMap(
      slices,
      sliceItems => {
        return fn(sliceItems);
      },
      { concurrency: options.concurrency }
    );
  };
  
  
  export const arrayToMap = (list, key)=>{
    return list.reduce((agg, item)=>{
      agg[item[key]] = item
      return agg
    },{})
  }
  
  export const padZeros =(n, width, z)=>{
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  
  export const flatten = (array)=>{
    return array.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
  }