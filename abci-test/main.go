package main

import (
	"flag"
	"os"

	"github.com/tendermint/abci/server"
	"github.com/tendermint/tmlibs/common"
	"github.com/tendermint/tmlibs/log"
	mapp "github.com/troush/abci-test/app"
)

func main() {

	addrPtr := flag.String("addr", "tcp://0.0.0.0:46658", "Listen address")
	abciPtr := flag.String("abci", "socket", "socket | grpc")
	flag.Parse()

	logger := log.NewTMLogger(log.NewSyncWriter(os.Stdout))

	// Create the application - in memory or persisted to disk
	app := mapp.NewPersistentKeyValueApplication(".")

	// Start the listener
	srv, err := server.NewServer(*addrPtr, *abciPtr, app)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	srv.SetLogger(logger.With("module", "abci-server"))

	if err := srv.Start(); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	// Wait forever
	common.TrapSignal(func() {
		// Cleanup
		srv.Stop()
	})
}
