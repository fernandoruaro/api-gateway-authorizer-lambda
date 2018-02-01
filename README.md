# AWS Api Gateway Authorizer Lambda
Lambda for restricting access based on the name of the ApiKey. 
An ApiKey with name foo will only have access to /foo/*

When creating the Authorizer, use the type `Lambda` and `Request` as the`Event Payload`
