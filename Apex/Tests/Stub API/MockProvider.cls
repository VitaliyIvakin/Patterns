public class MockProvider implements System.StubProvider{
    public Object handleMethodCall(Object stubbedObject, String stubbedMethodName, 
        Type returnType, List<Type> listOfParamTypes, List<String> listOfParamNames,  List<Object> listOfArgs) {
            if(stubbedObject instanceof MyClass && stubbedMethodName == 'myMethod'){
                return 'some mock results depends on real return type';
            }else{
                return null;
            }       
    }
}

// using in tests
@isTest
static void someTest(){
    MyClass mockInstance = (MyClass)Test.createStub(MyClass.class, new MockProvider());
    System.debug('Mock result = ' + mockInstance.myMethod());
    System.debug('Real result = ' + new MyClass().myMethod());
}
