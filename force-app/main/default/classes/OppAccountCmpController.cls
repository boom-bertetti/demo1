public with sharing class OppAccountCmpController {
    @AuraEnabled(cacheable=true)
    public static Account getAccount(Id accountId){

        return [SELECT Id, Name, Phone, AccountNumber FROM Account WHERE Id = :accountId LIMIT 1];
    }
}
