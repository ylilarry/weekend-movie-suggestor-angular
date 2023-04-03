package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(lambdaHandler)
}

type RequestData struct {
	Query []string `json:"query,omitempty"`
}

type ResponseData struct {
	Movies []MovieData `json:"movies"`
}

func handle(request events.APIGatewayV2HTTPRequest) (*events.APIGatewayV2HTTPResponse, error) {
	requestData := RequestData{
		Query: []string{},
	}
	if err := json.Unmarshal([]byte(request.Body), &requestData); err != nil {
		return apiGatewayErrorResponse(400, "BAD_REQUEST", err.Error()), nil
	}
	if len(requestData.Query) == 0 {
		return apiGatewayErrorResponse(400, "BAD_REQUEST", "query is required"), nil
	}
	results := make([]MovieData, 0)
	tmdb, err := TmdbClient()
	if err != nil {
		return nil, err
	}
	for _, q := range requestData.Query {
		movie, err := SearchMovie(tmdb, q)
		if err != nil {
			fmt.Println(err)
		}
		if movie != nil {
			results = append(results, *movie)
		}
	}

	respbody, err := json.Marshal(results)
	if err != nil {
		return nil, err
	}
	resp := events.APIGatewayV2HTTPResponse{
		StatusCode: http.StatusOK,
		Body:       string(respbody),
	}
	return &resp, nil
}

func lambdaHandler(request events.APIGatewayV2HTTPRequest) (*events.APIGatewayV2HTTPResponse, error) {
	if response, err := handle(request); err == nil {
		if response.Headers == nil {
			response.Headers = make(map[string]string)
		}
		response.Headers["Access-Control-Allow-Origin"] = "*"
		response.Headers["Access-Control-Allow-Headers"] = "*"
		response.Headers["Access-Control-Allow-Methods"] = "*"
		return response, nil
	} else {
		response := apiGatewayErrorResponse(500, "INTERNAL_SERVER_ERROR", err.Error())
		return response, err
	}
}

func apiGatewayErrorResponse(code int, reason string, message string) *events.APIGatewayV2HTTPResponse {
	body, err := json.Marshal(map[string]string{
		"reason":  reason,
		"message": message,
	})
	if err != nil {
		resp := events.APIGatewayV2HTTPResponse{
			StatusCode: code,
			Body:       err.Error(),
		}
		return &resp
	} else {
		resp := events.APIGatewayV2HTTPResponse{
			StatusCode: code,
			Body:       string(body),
		}
		return &resp
	}
}
