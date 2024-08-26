class ServiceInterface {
    doSomething(){}
}


class Alien {
  doThingsDifferently(){
    console.log('doing things differently');
  }
}

class Adapter extends ServiceInterface{
  // adapter contains alien object and implements service interface (wrapping)
  constructor(alienObject){
    super();
    this.alienObject = alienObject;
  }
  doSomething(){
    this.alienObject.doThingsDifferently();
  }
}

class Client {
  doLogic(serviceObject){
    if (serviceObject instanceof ServiceInterface) {
      serviceObject.doSomething();
    }
  }
}

const concreteService = new Adapter(new Alien());
new Client().doLogic(concreteService);
