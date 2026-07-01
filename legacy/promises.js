const myPromise = new Promise((resolve, reject) => {
  resolve('resolved');
  reject('rejected');
});

myPromise.then(a => console.log(a));