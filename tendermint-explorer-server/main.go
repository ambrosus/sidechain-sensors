package main

import (
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/tidwall/gjson"
)

func health(c echo.Context) error {
	resp, err := http.Get("http://localhost:46657/abci_info")
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	return c.JSON(http.StatusOK, string(body[:]))
}

func chainStatus(c echo.Context) error {
	resp, err := http.Get("http://localhost:46657/abci_query?data=\"chain_status\"")
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	json := string(body)
	var result string
	result = gjson.Get(json, "result.response.log").String()
	return c.JSON(http.StatusOK, result)
}

func seed(c echo.Context) error {
	resp, err := http.Get("http://localhost:46657/abci_query?data=\"seed\"")
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	json := string(body)
	var result string
	result = gjson.Get(json, "result.response.log").String()
	return c.JSON(http.StatusOK, result)
}

func block(c echo.Context) error {
	height := c.QueryParam("height")
	resp, err := http.Get("http://localhost:46657/block_results?height=" + height)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	json := string(body)
	var result string
	result = gjson.Get(json, "result.results.DeliverTx").String()

	return c.JSON(http.StatusOK, result)
}

type params struct {
	Seed  string
	Rules string
}

func initilizeChain(c echo.Context) (err error) {
	p := new(params)
	if err = c.Bind(p); err != nil {
		return
	}
	resp, err := http.Get("http://localhost:46657/broadcast_tx_commit?tx=\"initilize_chain:" + p.Seed + ":" + p.Rules + "\"")

	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Tendermint offline")
	}
	json := string(body)
	return c.JSON(http.StatusOK, json)
}
func main() {
	e := echo.New()
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))
	r := e.Group("/")
	jwtConfig := middleware.JWTConfig{
		SigningKey: []byte("6HCVdaZbdrwxsHkSIMsK5ytKu3TSdi2e"),
	}
	r.Use(middleware.JWTWithConfig(jwtConfig))
	r.GET("check_health", health)
	r.GET("chain_status", chainStatus)
	r.GET("block", block)
	r.GET("seed", seed)
	r.POST("init_chain", initilizeChain)
	r.GET("", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":1323"))
}
