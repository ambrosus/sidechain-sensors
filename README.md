# About
This was a proof of concept developed internally, it's using tendermint to store sensor data from IOT devices in a sidechain. It's an early prototype so use it with caution. Feedback welcome.

# Install


## OS Deps

```
brew update
brew install golang
brew install glide
brew install dep
```

## Go Presetup
```
export GOPATH=$HOME/go
export GOROOT=/usr/local/opt/go/libexec
export PATH=$PATH:$GOPATH/bin
export PATH=$PATH:$GOROOT/bin
mkdir -p $GOPATH $GOPATH/src $GOPATH/pkg $GOPATH/bin
```

## Tendermint Install
```
mkdir -p $GOPATH/src/github.com/tendermint/tendermint
git clone https://github.com/tendermint/tendermint $GOPATH/src/github.com/tendermint/tendermint
cd $GOPATH/src/github.com/tendermint/tendermint
make get_vendor_deps && make install
tendermint init
```

## Abci Install
```
cd ~/ambrosus
mkdir -p $GOPATH/src/github.com/ambrosus && cp -r abci-ambrosus $GOPATH/src/github.com/ambrosus/abci-ambrosus
cd $GOPATH/src/github.com/ambrosus/abci-ambrosus
glide install
```

## Server install
```
cd ~/ambrosus
cp -r tendermint-explorer-server $GOPATH/src/github.com/ambrosus/tendermint-explorer-server
cd $GOPATH/src/github.com/ambrosus/tendermint-explorer-server
glide install
```

## WebUI Run
```
cd ~/ambrosus/tendermint-explorer
npm install
```

## Clean

```
rm -r $HOME/.tendermint
tendermint init
rm -r $GOPATH/src/github.com/ambrosus/abci-ambrosus/keyvalue.db
```

## Start

```
cd ~/ambrosus/tendermint-explorer
tendermint node --consensus.create_empty_blocks=false
go run $GOPATH/src/github.com/ambrosus/tendermint-explorer-server/main.go
npm run react:start
cd $GOPATH/src/github.com/ambrosus/abci-ambrosus && go run $GOPATH/src/github.com/ambrosus/abci-ambrosus/main.go
```
