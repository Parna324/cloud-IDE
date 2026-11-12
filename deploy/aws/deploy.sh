#!/usr/bin/env bash
set -euo pipefail

REGION="ap-southeast-2"
ARCHIVE="${1:-$HOME/cloud-ide-deploy.zip}"

if [[ ! -f "$ARCHIVE" ]]; then
  echo "Archive not found: $ARCHIVE"
  echo "Upload cloud-ide-deploy.zip to CloudShell, then run this script again."
  exit 1
fi

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
VPC_ID="$(aws ec2 describe-vpcs --region "$REGION" --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
if [[ -z "$VPC_ID" || "$VPC_ID" == "None" ]]; then
  echo "No default VPC exists in $REGION. Create one or use a VPC-aware deployment template."
  exit 1
fi

read -r -p "Your public IPv4 address with /32 (example: 203.0.113.10/32): " ALLOWED_CIDR
if [[ ! "$ALLOWED_CIDR" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}/(3[0-2]|[12]?[0-9])$ ]]; then
  echo "Expected an IPv4 CIDR such as 203.0.113.10/32."
  exit 1
fi

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT
unzip -q "$ARCHIVE" -d "$WORK_DIR"
TEMPLATE="$WORK_DIR/deploy/aws/ec2-stack.yaml"
if [[ ! -f "$TEMPLATE" ]]; then
  echo "The archive does not contain deploy/aws/ec2-stack.yaml."
  exit 1
fi

BUCKET="cloud-ide-${ACCOUNT_ID}-${RANDOM}${RANDOM}"
aws s3api create-bucket --region "$REGION" --bucket "$BUCKET" \
  --create-bucket-configuration "LocationConstraint=$REGION"
aws s3 cp "$ARCHIVE" "s3://$BUCKET/cloud-ide-deploy.zip" --region "$REGION"

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name cloud-ide \
  --template-file "$TEMPLATE" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    VpcId="$VPC_ID" \
    SourceBucket="$BUCKET" \
    SourceKey=cloud-ide-deploy.zip \
    AllowedCidr="$ALLOWED_CIDR"

aws cloudformation describe-stacks --region "$REGION" --stack-name cloud-ide \
  --query 'Stacks[0].Outputs' --output table
echo "Archive bucket: $BUCKET (keep it until the app has started successfully)."
