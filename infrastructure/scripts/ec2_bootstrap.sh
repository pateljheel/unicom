#!/bin/bash
# Update system and install Apache
yum update -y
yum install -y httpd

# Create a simple HTML file
echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html

# Start and enable Apache
systemctl start httpd
systemctl enable httpd

echo "Apache installed and started successfully."
