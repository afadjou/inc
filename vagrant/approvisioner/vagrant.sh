#!/bin/bash
DBHOST=localhost
DBNAME=vagrant
DBUSER=vagrant
DBPASSWD=vagrant

echo "#################### System Upgrade #######################"
echo ">> sudo apt update && sudo apt upgrade"
sudo apt update && sudo apt upgrade

echo "######################## PHP install ######################"
echo ">> sudo apt -y install php7.4 libapache2-mod-php7.4 php7.4-mysql php-common php7.4-cli php7.4-common php7.4-json php7.4-opcache php7.4-readline php7.4-curl php7.4-dom php7.4-gd"
sudo apt -y install php7.4 libapache2-mod-php7.4 php7.4-mysql php-common php7.4-cli php7.4-common php7.4-json php7.4-opcache php7.4-readline php7.4-curl php7.4-dom php7.4-gd php7.4-mbstring php7.4-zip php-xml
echo "################## Activate Apache module #################"
echo ">> sudo a2enmod php7.4"
sudo a2enmod php7.4

echo "################# Ports activate ##########################"
echo ">> sudo ufw allow 8080/tcp "
sudo ufw allow 8080/tcp
echo ">> sudo ufw allow 443/tcp"
sudo ufw allow 443/tcp

echo "################## Apache - disable #######################"
echo ">> sudo systemctl stop apache2"
sudo systemctl stop apache2
echo ">> sudo systemctl disable apache2"
sudo systemctl disable apache2

echo ">> ################## WEB - Virtualhost ###################"
sudo "sudo cp /vagrant/apache/conf/apache.default.conf /etc/apache2/conf-available/apache.default.conf"
sudo cp /vagrant/apache/conf/apache.default.conf /etc/apache2/conf-available/apache.default.conf
echo ">> cd /etc/apache2/conf-enabled"
cd /etc/apache2/conf-enabled
echo "sudo ln -s /etc/apache2/conf-available/apache.default.conf apache.default.conf"
sudo ln -s /etc/apache2/conf-available/apache.default.conf apache.default.conf
sudo "sudo cp /vagrant/apache/sites/site.default.ssl.conf /etc/apache2/conf-available/site.default.ssl.conf"
sudo cp /vagrant/apache/sites/site.default.ssl.conf /etc/apache2/sites-available/site.default.ssl.conf
sudo "sudo cp /vagrant/apache/sites/aviaco.angular.conf /etc/apache2/conf-available/aviaco.angular.conf"
sudo cp /vagrant/apache/sites/aviaco.angular.local.conf /etc/apache2/sites-available/aviaco.angular.local.conf
echo ">> cd /etc/apache2/sites-enabled"
cd /etc/apache2/sites-enabled
echo ">> sudo ln -s /etc/apache2/sites-available/site.default.ssl.conf site.default.ssl.conf"
sudo ln -s /etc/apache2/sites-available/site.default.ssl.conf site.default.ssl.conf
echo ">> sudo ln -s /etc/apache2/sites-available/aviaco.angular.conf aviaco.angular.conf"
sudo ln -s /etc/apache2/sites-available/aviaco.angular.local.conf aviaco.angular.local.conf
echo ">> cd ~"
cd ~

echo "################## NodeJs 14 Install ####################"
echo ">> curl -sL https://deb.nodesource.com/setup_14.x -o setup_14.sh"
curl -sL https://deb.nodesource.com/setup_14.x -o setup_14.sh
echo ">> sudo sh ./setup_14.sh"
sudo sh ./setup_14.sh
echo ">> sudo apt update"
sudo apt update
echo ">> sudo apt install nodejs"
sudo apt install nodejs
echo ">> node -v"
node -v
echo ">> npm -v"
npm -v

echo "################ Angular CLI - 15 Install ##################"
echo ">> npm install -g @angular/cli@15"
npm install -g @angular/cli@15
echo ">> ng version"
ng version

echo "#################### HeliApp Init #####################"
echo ">> cd /var/www/html"
cd /var/www/html
echo ">> mkdir -p aviaco/heliapp"
mkdir -p aviaco/heliapp
echo ">> cd aviaco/heliapp"
cd aviaco/heliapp

echo "################ DevExtreme  Install ##################"
echo ">> npm install devextreme@22.2 devextreme-angular@22.2 --save --save-exact"
npm install devextreme@22.2 devextreme-angular@22.2 --save --save-exact

echo "################ Bootstrap  Install ##################"
echo ">> npm install bootstrap"
npm install bootstrap

echo "################ FontAWesome  Install ##################"
echo ">> npm install --save font-awesome angular-font-awesome"
npm install font-awesome angular-font-awesome

echo "################ RxJs  Install ##################"
echo ">> npm install rxjs"
npm install rxjs

echo "################ XlsX  Install ##################"
echo ">> npm install xlsx"
npm install xlsx

echo "################ ExcelJs  Install ##################"
echo ">> npm install exceljs"
npm install exceljs

echo "################ File-saver  Install ##################"
echo ">> npm install file-saver ngx-filesaver"
npm install file-saver ngx-filesaver
npm i --save-dev @types/file-saver

echo "################ Material  Install ##################"
echo ">> ng add @angular/material"
ng add @angular/material

echo "################ FireBase  Install ##################"
echo ">> npm install firebase @angular/fire"
npm install firebase @angular/fire

echo "export NODE_OPTIONS=--max_old_space_size=4096" >> ~/.bashrc
source ~/.bashrc
echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf
sudo sysctl -p

echo ">> ############### Change /var/www/html permission ######"
echo "cd /var/www"
cd /var/www
echo ">> sudo chmod -R 777 html"
sudo chmod -R 777 html

echo "############# www-data permissions ########################"
echo ">> sudo chown vagrant:vagrant /var/www/html/ -R"
sudo chown vagrant:vagrant /var/www/html/ -R

echo "#########################################################"
echo "################### Installation terminée ###############"
echo "#########################################################"




