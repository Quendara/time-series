# Resolver

## DynamoDB Schema

```json
{
  "id": {
    "S": "1615550462234"
  },
  "owner": {
    "S": "andre"
  },
  "listid": {
    "S": "2"
  },
  "checked": {
    "BOOL": true
  },
  "group": {
    "S": "Renovierung"
  },
  "link": {
    "S": ""
  },
  "name": {
    "S": "Bauschutt entsorgen"
  }
}
```

https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-putitem

## App Sync Resolver
```json
// on Create
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
    "owner": $util.dynamodb.toDynamoDBJson($ctx.args.input.owner),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
  "condition": {
    "expression": "attribute_not_exists(#id) AND attribute_not_exists(#owner)",
    "expressionNames": {
      "#id": "id",
      "#owner": "owner",
    },
  },
}

// almost working
{
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key" : {
        "id": $util.dynamodb.toDynamoDBJson($util.autoId()),
        "group": $util.dynamodb.toDynamoDBJson($ctx.result.group)
    },
    "attributeValues" : {
    	"name":$util.dynamodb.toDynamoDBJson($ctx.result.name),
        "checked":$util.dynamodb.toDynamoDBJson($ctx.result.checked),
      }
    
}

{
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key" : {
        "id": $util.dynamodb.toDynamoDBJson($util.autoId()),
    },
    "attributeValues" : $util.dynamodb.toMapValuesJson($ctx.args)
}
```

```json
// ## Resonse

"id": $util.dynamodb.toDynamoDBJson($util.autoId()),
```