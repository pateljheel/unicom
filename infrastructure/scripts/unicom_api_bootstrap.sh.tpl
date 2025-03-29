#!/bin/bash
# Update system and install Apache

# Configre AWS CLI region
aws configure set region ${aws_region}

# Copy app files from s3 bucket
cd /home/ec2-user
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
mkdir app
aws s3 cp s3://${app_bucket}/app/ app/ --recursive
aws s3 cp s3://${app_bucket}/keys/ keys/ --recursive
python3 -m venv env
source env/bin/activate
# yum install python3-pip -y

# Start the application
cd app
pip install -r requirements.txt
python3 app.py
