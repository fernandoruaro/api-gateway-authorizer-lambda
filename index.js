'use strict';
console.log('Loading function');

const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    const apiKey = event.requestContext.identity.apiKeyId;
    const apigateway = new AWS.APIGateway();
    const apiKeyParams = {
        apiKey: apiKey
    }
    apigateway.getApiKey(apiKeyParams, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback('Unauthorized');
        } else {
            console.log(data);
            const awsAccountId = event.requestContext.accountId;
            const region = event.methodArn.split(':')[3];
            const restApiId = event.requestContext.apiId;
            const stage = event.requestContext.stage;
            const resource = "arn:aws:execute-api:".concat(region, ":", awsAccountId,
                ":", restApiId, "/", stage, "/*/", data.name, "/*")
            callback(null, {
                "principalId": apiKey,
                "policyDocument": {
                    "Statement": [{
                        "Action": "execute-api:Invoke",
                        "Effect": "Allow",
                        "Resource": resource
                    }],
                    "Version": "2012-10-17"
                },
                "context": {
                    "username": data.name
                }
            });
        }
    });
};
