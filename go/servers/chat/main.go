package main

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/chatgp/gpt3"
)

func main() {
	lambda.Start(lambdaHandler)
}

type RequestData struct {
	Messages []ChatGPTMessage `json:"messages"`
}

type ResponseData struct {
	Message ChatGPTMessage `json:"message"`
}

var chatGPTClient *gpt3.Client

func handle(request events.APIGatewayV2HTTPRequest) (*events.APIGatewayV2HTTPResponse, error) {
	requestData := RequestData{}
	if err := json.Unmarshal([]byte(request.Body), &requestData); err != nil {
		return apiGatewayErrorResponse(400, "BAD_REQUEST", err.Error()), nil
	}
	if len(requestData.Messages) == 0 {
		return apiGatewayErrorResponse(400, "BAD_REQUEST", "messages is required"), nil
	}
	if chatGPTClient == nil {
		var err error
		chatGPTClient, err = ChatGPTClient()
		if err != nil {
			return nil, err
		}
	}
	response, err := chat(chatGPTClient, requestData.Messages)
	if err != nil {
		return nil, err
	}
	responseData := ResponseData{
		Message: *response,
	}
	body, err := json.Marshal(responseData)
	if err != nil {
		return nil, err
	}
	resp := events.APIGatewayV2HTTPResponse{
		StatusCode: http.StatusOK,
		Body:       string(body),
		Headers:    make(map[string]string),
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
