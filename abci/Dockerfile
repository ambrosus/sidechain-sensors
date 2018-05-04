FROM golang

# RUN go get -u github.com/tendermint/tendermint/cmd/tendermint/...
RUN go get -u github.com/tendermint/abci/...
RUN	go get -u github.com/tendermint/tmlibs/...
RUN	go get -u github.com/tendermint/iavl/...
RUN	go get -u github.com/tendermint/go-wire/...

# Copy the local package files to the container's workspace.
COPY . /go/src/github.com/dmytronasyrov/abci-test
RUN go install github.com/dmytronasyrov/abci-test

# Run the outyet command by default when the container starts.
RUN echo $PORT
ENTRYPOINT /go/bin/abci-test -addr tcp://0.0.0.0:$PORT

# Document that the service listens on port 8080.
EXPOSE 46659
EXPOSE 46658
EXPOSE 46660
