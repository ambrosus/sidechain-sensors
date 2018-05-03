package main

import (
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type params struct {
	Seed  string
	Rules string
}

func query(endpoint string, c echo.Context) error {
	resp, err := http.Get("http://localhost:46657/" + endpoint)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, "Invalid incoming JSON")
	}

	return c.JSON(http.StatusOK, string(body[:]))
}

func checkHealth(c echo.Context) error {
	return query("abci_info", c)
}

func chainStatus(c echo.Context) error {
	return query("abci_query?data=\"chain_status\"", c)

	// json := string(body)
	// result := gjson.Get(json, "result.response.log").String()

	// return c.JSON(http.StatusOK, result)
}

func seed(c echo.Context) error {
	return query("abci_query?data=\"seed\"", c)

	// json := string(body)
	// result := gjson.Get(json, "result.response.log").String()

	// return c.JSON(http.StatusOK, result)
}

func blocks(c echo.Context) error {
	height := c.QueryParam("height")

	return query("block_results?height="+height, c)

	// json := string(body)
	// result := gjson.Get(json, "result.results.DeliverTx").String()

	// return c.JSON(http.StatusOK, result)
}

func initChain(c echo.Context) (err error) {
	p := new(params)
	if err = c.Bind(p); err != nil {
		return
	}

	resp, err := http.Get("http://localhost:46657/broadcast_tx_commit?tx=\"initilize_chain:" + p.Seed + ":" + p.Rules + "\"")
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, err)
	}

	json := string(body)

	return c.JSON(http.StatusOK, json)
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	jwtConfig := middleware.JWTConfig{
		SigningKey: []byte("6HCVdaZbdrwxsHkSIMsK5ytKu3TSdi2e"),
	}

	r := e.Group("/")
	r.Use(middleware.JWTWithConfig(jwtConfig))
	r.GET("check_health", checkHealth)
	r.GET("chain_status", chainStatus)
	r.GET("blocks", blocks)
	r.GET("seed", seed)
	r.POST("init_chain", initChain)
	r.GET("", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":1323"))
}
