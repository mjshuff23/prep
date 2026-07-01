const Person = {
  name: 'mike',
  sayHi: function() {
    console.log('this', this);
    console.log(this.name);
  },
};

Person.sayHi();