# time-series

Small appliation to collect data of time series.

## Demo

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/time-series)

## Changelog
### 2019-01-09

* Support multiple users

### Next Features

* Create new serie
* Support Counter / Grauge

# Amplify
## ADD API
https://eu-central-1.console.aws.amazon.com/appsync/home?region=eu-central-1#/b65r3egydbhaxfjeofqyuvmp4y/v1/home

### Auth
amplify add auth

``` 
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
``` 

amplify init
amplify add codegen --apiId 5lxum6sspnehrc7p24vjq6ckri

## Update code gen.... when schema changed
amplify codegen
amplify push

# Cognito



aws cognito-idp add-custom-attributes --user-pool-id eu-central-1_8LkzpXcOV --custom-attributes Name="APIKEY",AttributeDataType="String",DeveloperOnlyAttribute=false,Required=false,StringAttributeConstraints="{MinLength=1,MaxLength=45}"
aws cognito-idp admin-update-user-attributes --user-pool-id eu-central-1_8LkzpXcOV --username andre --user-attributes Name="custom:APIKEY",Value="XXXX"


