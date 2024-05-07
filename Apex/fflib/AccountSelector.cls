public inherited sharing class AccountSelector extends fflib_SObjectSelector {

    public AccountSelector(){
        /* call the fflib_SObjectSelector constructor to customize default settings
        1)  Boolean includeFieldSetFields,
        2)  Boolean enforceCRUD,
        3)  Boolean enforceFLS, 
        4)  Boolean sortSelectFields,
        5)  fflib_SObjectSelector.DataAccess dataAccess
        */
        super(false, true, true, false, fflib_SObjectSelector.DataAccess.USER_MODE);
    }

    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField>{
            Account.Id,
            Account.Name
        };
    }
  
    public Schema.SObjectType getSObjectType(){
        return Account.SObjectType;
    }

    public List<Account> selectById(Set<Id> idSet){
        return (List<Account>) selectSObjectsById(idSet);
    }
  
}
