package app

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/tendermint/abci/example/code"
	"github.com/tendermint/abci/types"
	wire "github.com/tendermint/go-wire"
	"github.com/tendermint/iavl"
	dbm "github.com/tendermint/tmlibs/db"
	"github.com/tendermint/tmlibs/log"
)

const (
	// RegSetChangePerfix for registration process
	RegSetChangePerfix string = "reg:"

	// SensorPrefix for data from sensors
	SensorPrefix string = "sensor:"
	// InitilizeChainPerfix for init chain
	InitilizeChainPerfix string = "initilize_chain:"

	// RegistredSensorsKey for saving the state of sensors in a list
	RegistredSensorsKey string = "registred_sensors"
)

//-----------------------------------------

var _ types.Application = (*PersistentKeyValueApplication)(nil)

// PersistentKeyValueApplication struct
type PersistentKeyValueApplication struct {
	app        *KeyValueApplication
	initilized bool
	logger     log.Logger
}

// RegistredSensorsList struct
type RegistredSensorsList struct {
	Sensors []string
}

// NewPersistentKeyValueApplication constructor
func NewPersistentKeyValueApplication(dbDir string) *PersistentKeyValueApplication {
	name := "keyvalue"
	db, err := dbm.NewGoLevelDB(name, dbDir)
	if err != nil {
		panic(err)
	}

	stateTree := iavl.NewVersionedTree(500, db)
	stateTree.Load()

	return &PersistentKeyValueApplication{
		app:    &KeyValueApplication{state: stateTree},
		logger: log.NewTMLogger(os.Stdout),
	}
}

// SetLogger settinup application logger
func (app *PersistentKeyValueApplication) SetLogger(l log.Logger) {
	app.logger = l
}

// Initilize start chain flag
func (app *PersistentKeyValueApplication) Initilize(flag bool) {
	app.initilized = flag
}

type InfoResponse struct {
	ChainInitilized bool `json:"chain_initilized"`
	Size            int  `json:"size"`
}

// Info return info about chain status
func (app *PersistentKeyValueApplication) Info(req types.RequestInfo) types.ResponseInfo {
	res := types.ResponseInfo{}
	var latestVersion uint64 = app.app.state.LatestVersion()
	res.LastBlockHeight = int64(latestVersion)
	res.LastBlockAppHash = app.app.state.Hash()
	data, err := json.Marshal(&InfoResponse{ChainInitilized: app.initilized, Size: app.app.state.Size()})
	if err != nil {
		panic(err)
	}
	res.Data = string(data)
	return res
}

func (app *PersistentKeyValueApplication) SetOption(req types.RequestSetOption) types.ResponseSetOption {
	return app.app.SetOption(req)
}

// DeliverTx is either "val:pubkey/power" or "key=value" or just arbitrary bytes
func (app *PersistentKeyValueApplication) DeliverTx(tx []byte) types.ResponseDeliverTx {
	// if it starts with "reg:", register new sensor
	if isInitilizeChainTx(tx) {
		return app.execInitilizeChainTx(tx)
	} else if isRegisterTx(tx) {
		return app.execRegisterTx(tx)
	} else if isSensorTx(tx) {
		return app.execSensorTx(tx)
	}
	app.logger.Info(strconv.FormatBool(app.initilized))
	if !app.initilized {
		return types.ResponseDeliverTx{Code: code.CodeTypeBadOption}
	}
	return app.app.DeliverTx(tx)
}

func (app *PersistentKeyValueApplication) CheckTx(tx []byte) types.ResponseCheckTx {
	return app.app.CheckTx(tx)
}

// Commit will panic if InitChain was not called
func (app *PersistentKeyValueApplication) Commit() types.ResponseCommit {

	// Save a new version for next height
	height := app.app.state.LatestVersion() + 1
	var appHash []byte
	var err error

	appHash, err = app.app.state.SaveVersion(height)
	if err != nil {
		panic(err)
	}

	app.logger.Info("Commit block", "height", height, "root", appHash)
	return types.ResponseCommit{Code: code.CodeTypeOK, Data: appHash}
}

func (app *PersistentKeyValueApplication) Query(reqQuery types.RequestQuery) types.ResponseQuery {
	return app.app.Query(reqQuery)
}

// Save the sensors in the merkle tree
func (app *PersistentKeyValueApplication) InitChain(req types.RequestInitChain) types.ResponseInitChain {
	app.CreateStoreForSensors()
	return types.ResponseInitChain{}
}

// BeginBlock Track the block hash and header information
func (app *PersistentKeyValueApplication) BeginBlock(req types.RequestBeginBlock) types.ResponseBeginBlock {
	return types.ResponseBeginBlock{}
}

// EndBlock callback
func (app *PersistentKeyValueApplication) EndBlock(req types.RequestEndBlock) types.ResponseEndBlock {
	return types.ResponseEndBlock{}
}

func isInitilizeChainTx(tx []byte) bool {
	return strings.HasPrefix(string(tx), InitilizeChainPerfix)
}

func isRegisterTx(tx []byte) bool {
	return strings.HasPrefix(string(tx), RegSetChangePerfix)
}

func isSensorTx(tx []byte) bool {
	return strings.HasPrefix(string(tx), SensorPrefix)
}

func (app *PersistentKeyValueApplication) execInitilizeChainTx(tx []byte) types.ResponseDeliverTx {
	tx = tx[len(InitilizeChainPerfix):]
	res := app.app.Query(types.RequestQuery{Path: "initilize", Prove: true})
	result := string(wire.BinaryBytes(res.Value)[2:])
	parts := bytes.Split(tx, []byte(":"))
	app.logger.Error(string(parts[0]))
	app.logger.Error(string(len(parts[0])))
	if result == "true" {
		return types.ResponseDeliverTx{Code: code.CodeTypeOK}
	}
	app.app.state.Set([]byte("chain_initilized"), wire.BinaryBytes("true"))
	app.app.state.Set([]byte("seed"), wire.BinaryBytes(parts[0]))
	app.app.state.Set([]byte("rules"), wire.BinaryBytes(parts[1]))
	app.Initilize(true)

	return app.DeliverTx([]byte("chain_initilized=true"))
}

func (app *PersistentKeyValueApplication) execSensorTx(tx []byte) types.ResponseDeliverTx {
	tx = tx[len(SensorPrefix):]
	var key, value []byte
	var timestamp string
	parts := bytes.Split(tx, []byte(":"))
	app.logger.Info(string(parts[0]))
	app.logger.Info(string(parts[1]))
	if len(parts) == 2 {
		key, value = parts[0], parts[1]
	} else {
		key, value = tx, tx
	}
	decoded, err := base64.StdEncoding.DecodeString(string(value))
	if err != nil {
		fmt.Println("decode error:", err)
	}
	parts = bytes.Split(decoded, []byte(":"))
	if len(parts) == 2 {
		value = parts[0]
		timestamp = string(parts[1])
	}
	app.app.state.Set(key, value)

	tags := []*types.KVPair{
		{Key: "app.sensor", ValueType: types.KVPair_STRING, ValueString: string(key)},
		{Key: "app.value", ValueType: types.KVPair_STRING, ValueString: string(value)},
		{Key: "app.timestamp", ValueType: types.KVPair_STRING, ValueString: string(timestamp)},
	}
	return types.ResponseDeliverTx{Code: code.CodeTypeOK, Tags: tags}
}
func (app *PersistentKeyValueApplication) execRegisterTx(tx []byte) types.ResponseDeliverTx {
	tx = tx[len(RegSetChangePerfix):]
	res := app.app.Query(types.RequestQuery{Data: []byte(RegistredSensorsKey), Height: 0, Path: "", Prove: true})
	result := fromBinary(res.Value)
	key, _ := randomHex(20)
	sl := RegistredSensorsList{append(result.Sensors, key)}

	app.app.state.Set([]byte(RegistredSensorsKey), toBinary(sl))

	return types.ResponseDeliverTx{Code: code.CodeTypeOK}
}

func (app *PersistentKeyValueApplication) CreateStoreForSensors() types.ResponseDeliverTx {
	emptySensorsList := RegistredSensorsList{[]string{}}
	binary := toBinary(emptySensorsList)
	logger := log.NewTMLogger(log.NewSyncWriter(os.Stdout))
	logger.Info(fmt.Sprintf("%X\n", binary))

	app.app.state.Set([]byte(RegistredSensorsKey), binary)
	return types.ResponseDeliverTx{Code: code.CodeTypeOK}
}

func toBinary(s interface{}) []byte {
	buf, n, err := new(bytes.Buffer), int(0), error(nil)
	wire.WriteBinary(s, buf, &n, &err)
	return buf.Bytes()
}

type Receiver interface{}

func fromBinary(from []byte) RegistredSensorsList {
	lmt, n, err := int(256), int(0), error(nil)
	recv := wire.ReadBinary(struct{ RegistredSensorsList }{}, bytes.NewReader(from), lmt, &n, &err).(struct{ RegistredSensorsList }).RegistredSensorsList
	return recv
}

func randomHex(n int) (string, error) {
	bytes := make([]byte, n)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
