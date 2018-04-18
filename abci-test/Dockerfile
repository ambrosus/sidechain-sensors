FROM golang

# Copy the local package files to the container's workspace.
COPY . /go/src/github.com/troush/abci-test

RUN go install github.com/troush/abci-test


# Run the outyet command by default when the container starts.
RUN echo $PORT
ENTRYPOINT /go/bin/abci-test -addr tcp://0.0.0.0:$PORT

# Document that the service listens on port 8080.
EXPOSE 46659
EXPOSE 46658
EXPOSE 46660
