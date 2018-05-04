package app

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/tendermint/abci/example/code"
	"github.com/tendermint/abci/types"
	wire "github.com/tendermint/go-wire"
	"github.com/tendermint/iavl"
	cmn "github.com/tendermint/tmlibs/common"
	dbm "github.com/tendermint/tmlibs/db"
)

var _ types.Application = (*KeyValueApplication)(nil)

type KeyValueApplication struct {
	types.BaseApplication

	state *iavl.VersionedTree
}

func NewKeyValueApplication() *KeyValueApplication {
	state := iavl.NewVersionedTree(0, dbm.NewMemDB())
	return &KeyValueApplication{state: state}
}

func (app *KeyValueApplication) Info(req types.RequestInfo) (resInfo types.ResponseInfo) {
	return types.ResponseInfo{Data: fmt.Sprintf("{\"size\":%v}", app.state.Size())}
}

// DeliverTx is either "key=value" or just arbitrary bytes
func (app *KeyValueApplication) DeliverTx(tx []byte) types.ResponseDeliverTx {
	var key, value []byte
	parts := bytes.Split(tx, []byte("="))
	if len(parts) == 2 {
		key, value = parts[0], parts[1]
	} else {
		key, value = tx, tx
	}
	app.state.Set(key, value)

	tags := []*types.KVPair{
		{Key: "app.creator", ValueType: types.KVPair_STRING, ValueString: "status_change"},
		{Key: "app.key", ValueType: types.KVPair_STRING, ValueString: string(key)},
		{Key: "app.value", ValueType: types.KVPair_STRING, ValueString: string(value)},
	}
	return types.ResponseDeliverTx{Code: code.CodeTypeOK, Tags: tags}
}

func (app *KeyValueApplication) CheckTx(tx []byte) types.ResponseCheckTx {
	return types.ResponseCheckTx{Code: code.CodeTypeOK}
}

func (app *KeyValueApplication) Commit() types.ResponseCommit {
	// Save a new version
	var hash []byte
	var err error

	if app.state.Size() > 0 {
		// just add one more to height (kind of arbitrarily stupid)
		height := app.state.LatestVersion() + 1
		hash, err = app.state.SaveVersion(height)
		if err != nil {
			// if this wasn't a keyvalue app, we'd do something smarter
			panic(err)
		}
	}

	return types.ResponseCommit{Code: code.CodeTypeOK, Data: hash}
}

// LogResponse struct for parsing query result return
type LogResponse struct {
	Exists bool   `json:"exists"`
	Value  string `json:"value"`
}

// Query callback for implimenting quering blockchain
func (app *KeyValueApplication) Query(reqQuery types.RequestQuery) (resQuery types.ResponseQuery) {
	switch reqQuery.Path {
	case "initilize":
		value, proof, err := app.state.GetWithProof([]byte("chain_initilized"))

		if err != nil {
			panic(err)
		}
		resQuery.Key = reqQuery.Data
		resQuery.Value = wire.BinaryBytes(value)
		resQuery.Proof = wire.BinaryBytes(proof)
		if value != nil {
			lr := &LogResponse{Exists: true, Value: string(wire.BinaryBytes(value)[2:])}
			log, err := json.Marshal(lr)
			if err != nil {
				panic(err)
			}
			resQuery.Log = string(log)
		} else {
			lr := &LogResponse{Exists: false, Value: ""}
			log, err := json.Marshal(lr)
			if err != nil {
				panic(err)
			}
			resQuery.Log = string(log)
		}
		return
	case "tx":
		return types.ResponseQuery{Value: []byte(cmn.Fmt("%v", 20))}
	default:
		value, proof, err := app.state.GetWithProof(reqQuery.Data)

		if err != nil {
			panic(err)
		}
		resQuery.Key = reqQuery.Data
		resQuery.Value = wire.BinaryBytes(value)
		resQuery.Proof = wire.BinaryBytes(proof)
		if value != nil {
			lr := &LogResponse{Exists: true, Value: string(wire.BinaryBytes(value)[2:])}
			log, err := json.Marshal(lr)
			if err != nil {
				panic(err)
			}
			resQuery.Log = string(log)
		} else {
			lr := &LogResponse{Exists: false, Value: ""}
			log, err := json.Marshal(lr)
			if err != nil {
				panic(err)
			}
			resQuery.Log = string(log)
		}
		return
	}
}
