public class Injection {
    public string doSomething() {
        return 'real doSomething()';
    }
}

public class Consumer {
    public static String doLogic(Injection injected) {
        return injected.doSomething();
    }
}

@isTest
class ConsumerTest {
    class InjectionStub implements System.StubProvider {
		public Object handleMethodCall(
            Object stubbedObject,
            String stubbedMethodName, 
        	Type returnType,
            List<Type> listOfParamTypes,
            List<String> listOfParamNames, 
        	List<Object> listOfArgs
        ) {
            System.debug(stubbedObject);
            if (stubbedMethodName == 'doSomething') {
                return 'stubbed doSomething()';
            }
            return null;
        }
    }
    @isTest
    static void doLogicTest() {
        Injection mockInjection = (Injection) Test.createStub(
            Injection.class, new InjectionStub());
        Test.startTest();
        String result = Consumer.doLogic(mockInjection);
        Test.stopTest();
        Assert.areEqual('stubbed doSomething()', result);
    }
}
