echo "################# NodeJs Install ######################"
echo ">> curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash"
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
echo ">> source ~/.bashrc"
source ~/.bashrc
#
# Après redemarrage du terminal
#
echo ">> nvm install 18 node"
nvm install 18 node                        # Mettre des version de numéro paire
echo ">> node --version"
node --version

echo "################ Angular CLI Install ##################"
echo ">> npm install -g @angular/cli"
npm install -g @angular/cli
echo ">> ng --version"
ng version