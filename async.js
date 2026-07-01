const myFunction = async function() {
  setTimeout(() => {
    console.log('done');
  }, 500)
}

myFunction();
await myFunction();