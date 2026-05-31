$ErrorActionPreference = "Stop"

$FUNCTION_NAME = "curebot-api"
$ROLE_NAME = "curebot-lambda-role"
$API_NAME = "curebot-http-api"

# Get region and account
$REGION = (aws configure get region 2>$null)
if (-not $REGION) { $REGION = "us-east-1" }
$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CureBot - Lahore AI Medical Agent" -ForegroundColor Cyan
Write-Host "  AWS Serverless Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Region: $REGION"
Write-Host "Account: $ACCOUNT_ID"

# Step 1: Create IAM Role
Write-Host "`n--- Step 1: Creating IAM Role ---" -ForegroundColor Yellow

$TRUST_POLICY = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
$TRUST_POLICY | Out-File -FilePath trust-policy.json -Encoding ascii -NoNewline

$ROLE_ARN = $null
try {
    $ROLE_ARN = (aws iam get-role --role-name $ROLE_NAME --query "Role.Arn" --output text 2>$null)
} catch {}

if (-not $ROLE_ARN -or $ROLE_ARN -eq "None") {
    Write-Host "Creating new role..."
    $ROLE_ARN = (aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-policy.json --query "Role.Arn" --output text)

    aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

    Write-Host "Waiting 10s for IAM role propagation..."
    Start-Sleep -Seconds 10
} else {
    Write-Host "Role already exists."
}

Write-Host "Role ARN: $ROLE_ARN" -ForegroundColor Green
Remove-Item -Force trust-policy.json -ErrorAction SilentlyContinue

# Step 2: Package and deploy Lambda
Write-Host "`n--- Step 2: Deploying Lambda Function ---" -ForegroundColor Yellow

if (Test-Path function.zip) { Remove-Item function.zip -Force }

# Package all required files (index.mjs + medical-ai.mjs + node_modules)
Write-Host "Packaging Lambda with dependencies..."
Compress-Archive -Path index.mjs, medical-ai.mjs, package.json, node_modules -DestinationPath function.zip -Force
$zipSize = [math]::Round((Get-Item function.zip).Length / 1MB, 2)
Write-Host "Package size: ${zipSize} MB" -ForegroundColor DarkCyan

$FUNCTION_EXISTS = $false
try {
    $null = (aws lambda get-function --function-name $FUNCTION_NAME 2>$null)
    $FUNCTION_EXISTS = $true
} catch {}

if ($FUNCTION_EXISTS) {
    Write-Host "Updating existing function..."
    $null = (aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://function.zip --output text)
    Write-Host "Waiting for update..."
    Start-Sleep -Seconds 5
    try {
        $null = (aws lambda update-function-configuration --function-name $FUNCTION_NAME --runtime nodejs20.x --handler index.handler --timeout 30 --memory-size 256 --output text 2>$null)
    } catch {}
} else {
    Write-Host "Creating new function..."
    $null = (aws lambda create-function --function-name $FUNCTION_NAME --runtime nodejs20.x --role $ROLE_ARN --handler index.handler --zip-file fileb://function.zip --timeout 30 --memory-size 256 --output text)
    Write-Host "Waiting for function to become active..."
    Start-Sleep -Seconds 5
}

$LAMBDA_ARN = (aws lambda get-function --function-name $FUNCTION_NAME --query "Configuration.FunctionArn" --output text)
Write-Host "Lambda ARN: $LAMBDA_ARN" -ForegroundColor Green

# Step 3: Create HTTP API Gateway
Write-Host "`n--- Step 3: Creating API Gateway HTTP API ---" -ForegroundColor Yellow

$API_ID = (aws apigatewayv2 get-apis --query "Items[?Name=='$API_NAME'].ApiId | [0]" --output text 2>$null)

if (-not $API_ID -or $API_ID -eq "None") {
    Write-Host "Creating new HTTP API..."
    $API_ID = (aws apigatewayv2 create-api --name $API_NAME --protocol-type HTTP --cors-configuration "AllowOrigins=*,AllowMethods=POST,GET,OPTIONS,AllowHeaders=Content-Type,Authorization" --query "ApiId" --output text)
    Write-Host "Created API: $API_ID" -ForegroundColor Green
} else {
    $null = (aws apigatewayv2 update-api --api-id $API_ID --cors-configuration "AllowOrigins=*,AllowMethods=POST,GET,OPTIONS,AllowHeaders=Content-Type,Authorization" --output text)
    Write-Host "Using existing API: $API_ID" -ForegroundColor Green
}

# Step 4: Create Lambda Integration
Write-Host "`n--- Step 4: Creating Integration ---" -ForegroundColor Yellow

$INTEGRATION_ID = (aws apigatewayv2 get-integrations --api-id $API_ID --query "Items[?IntegrationUri=='$LAMBDA_ARN'].IntegrationId | [0]" --output text 2>$null)

if (-not $INTEGRATION_ID -or $INTEGRATION_ID -eq "None") {
    $INTEGRATION_ID = (aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-uri $LAMBDA_ARN --payload-format-version "2.0" --query "IntegrationId" --output text)
    Write-Host "Created Integration: $INTEGRATION_ID" -ForegroundColor Green
} else {
    Write-Host "Using existing Integration: $INTEGRATION_ID" -ForegroundColor Green
}

# Step 5: Create Route POST /chat
Write-Host "`n--- Step 5: Creating Routes ---" -ForegroundColor Yellow

# POST /chat route
$ROUTE_ID = (aws apigatewayv2 get-routes --api-id $API_ID --query "Items[?RouteKey=='POST /chat'].RouteId | [0]" --output text 2>$null)

if (-not $ROUTE_ID -or $ROUTE_ID -eq "None") {
    $ROUTE_ID = (aws apigatewayv2 create-route --api-id $API_ID --route-key "POST /chat" --target "integrations/$INTEGRATION_ID" --query "RouteId" --output text)
    Write-Host "Created POST /chat route: $ROUTE_ID" -ForegroundColor Green
} else {
    $null = (aws apigatewayv2 update-route --api-id $API_ID --route-id $ROUTE_ID --target "integrations/$INTEGRATION_ID" --output text)
    Write-Host "Updated POST /chat route: $ROUTE_ID" -ForegroundColor Green
}

# GET /chat route (health check)
$GET_ROUTE_ID = (aws apigatewayv2 get-routes --api-id $API_ID --query "Items[?RouteKey=='GET /chat'].RouteId | [0]" --output text 2>$null)

if (-not $GET_ROUTE_ID -or $GET_ROUTE_ID -eq "None") {
    $GET_ROUTE_ID = (aws apigatewayv2 create-route --api-id $API_ID --route-key "GET /chat" --target "integrations/$INTEGRATION_ID" --query "RouteId" --output text)
    Write-Host "Created GET /chat route: $GET_ROUTE_ID" -ForegroundColor Green
} else {
    $null = (aws apigatewayv2 update-route --api-id $API_ID --route-id $GET_ROUTE_ID --target "integrations/$INTEGRATION_ID" --output text)
    Write-Host "Updated GET /chat route: $GET_ROUTE_ID" -ForegroundColor Green
}

# Step 6: Create/Update prod stage
Write-Host "`n--- Step 6: Deploying Stage ---" -ForegroundColor Yellow

$STAGE_EXISTS = $false
try {
    $null = (aws apigatewayv2 get-stage --api-id $API_ID --stage-name prod 2>$null)
    $STAGE_EXISTS = $true
} catch {}

if (-not $STAGE_EXISTS) {
    $null = (aws apigatewayv2 create-stage --api-id $API_ID --stage-name prod --auto-deploy --output text)
    Write-Host "Created prod stage with auto-deploy" -ForegroundColor Green
} else {
    Write-Host "Prod stage already exists" -ForegroundColor Green
}

# Step 7: Add Lambda Permission
Write-Host "`n--- Step 7: Adding Lambda Permission ---" -ForegroundColor Yellow

$TIMESTAMP = [int][double]::Parse((Get-Date -UFormat %s))
$STATEMENT_ID = "apigateway-invoke-$TIMESTAMP"
try {
    $null = (aws lambda add-permission --function-name $FUNCTION_NAME --statement-id $STATEMENT_ID --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" --output text)
    Write-Host "Permission added" -ForegroundColor Green
} catch {
    Write-Host "(Permission may already exist - OK)" -ForegroundColor DarkYellow
}

# Final Output
$API_URL = "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/chat"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  CureBot Deployment Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Public API URL:" -ForegroundColor Cyan
Write-Host "  $API_URL" -ForegroundColor White
Write-Host ""
Write-Host "Test Commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Health Check:" -ForegroundColor DarkCyan
Write-Host "  curl $API_URL"
Write-Host ""
Write-Host "  Chat (Greeting):" -ForegroundColor DarkCyan
Write-Host "  curl -X POST $API_URL -H `"Content-Type: application/json`" -d '{`"message`":`"hello`"}'"
Write-Host ""
Write-Host "  Book Lab Test:" -ForegroundColor DarkCyan
Write-Host "  curl -X POST $API_URL -H `"Content-Type: application/json`" -d '{`"message`":`"Book blood test at Chughtai Lab tomorrow morning`"}'"
Write-Host ""
Write-Host "  Find Hospital:" -ForegroundColor DarkCyan
Write-Host "  curl -X POST $API_URL -H `"Content-Type: application/json`" -d '{`"message`":`"Find nearest hospital in Gulberg`"}'"
Write-Host ""
Write-Host "  Emergency:" -ForegroundColor DarkCyan
Write-Host "  curl -X POST $API_URL -H `"Content-Type: application/json`" -d '{`"message`":`"emergency`"}'"
Write-Host ""
Write-Host "============================================" -ForegroundColor Green

# Cleanup
Remove-Item -Force function.zip -ErrorAction SilentlyContinue
