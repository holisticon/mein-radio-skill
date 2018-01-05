Welcome to the mein-radio Alexa Skill
==============================================

This skill gets the currently running track on an radio station. For each supported
radio station there is a js file in the cartridges folder.

What's Here
-----------

* README.md - This file
* package.json - The npm dependencies
* buildspec.yml - This YAML file is used by AWS CodeBuild to create an artifact
  that can be used to deploy to AWS Lambda through CloudFormation.
* index.js - This file contains the AWS Lambda code used to interact with Alexa.
  It relies on js files in the cartridges directory.
* cartridges - The directory containing the js functions which get the information
  from the corresponding radio stations.
* test - The directory containing json files for test.
* template.yml - This YAML file is used by AWS CloudFormation to update AWS Lambda
  and manage any additional AWS resources.

Deploying
---------------

Just push your commits to github. Everything else is done by "the cloud" ;-)

Testing
------------------

Use SAM Local and test JSON files for local testing (manually).

https://docs.aws.amazon.com/lambda/latest/dg/test-sam-local.html?shortFooter=true

'sam local invoke -e test/bytefm.json'