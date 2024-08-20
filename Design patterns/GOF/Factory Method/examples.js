class Furniture {
  getSomething(){
    return 'furniture staff';
  }  
}

class Chair extends Furniture {
  getSomething(){
    return 'chair staff';
  }
}

class Table extends Furniture {
  getSomething(){
    return 'table staff';
  }  
}

class Sofa extends Furniture {
}

class Factory{
  productsMap = {Chair, Table, Sofa};
  create(className){
     if(!this.productsMap.hasOwnProperty(className)){
       throw `class name \'${className}\ is absent in the factory'`;
     }
     return new this.productsMap[className]
  }
}

const concreteProduct = new Factory().create('Chair');
if (concreteProduct instanceof Furniture) {
   console.log(concreteProduct.getSomething());
}


///// The idea is to use object as a map of classes///////
///// in fact classes well be functions of the map-object ////////

///// using classes /////
class Chair {
  getParams(){
    return 'chair params';
  }
}

class Table {
  getParams(){
    return 'table params';
  }  
}

///// using functions /////
function draw(param){
  console.log('draw ' + param);
}

function jump(param){
  console.log('jump ' + param);
}

const productsMap = {Chair, Table, draw, jump};

const className = 'Table';
const furniture = new productsMap[className];
console.log(furniture.getParams());


const funcName = 'draw';
productsMap[funcName]('quickly');
