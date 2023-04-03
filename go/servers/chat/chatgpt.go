package main

import (
	"encoding/json"
	"fmt"
	"time"

	color "github.com/TwiN/go-color"
	"github.com/chatgp/gpt3"
)

func ChatGPTClient() (*gpt3.Client, error) {
	apiKey, err := getSSMParameter("weekend-movie-suggestor.ChatGPT_API_KEY")
	if err != nil {
		return nil, err
	}

	// new gpt-3 client
	client, err := gpt3.NewClient(&gpt3.Options{
		ApiKey:  apiKey,
		Timeout: 60 * time.Second,
		Debug:   false,
	})

	if err != nil {
		return nil, err
	}

	return client, nil
}

type ChatGPTMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func chat(client *gpt3.Client, message []ChatGPTMessage) (*ChatGPTMessage, error) {
	uri := "/v1/chat/completions"
	messages := []map[string]interface{}{}
	for _, m := range message {
		messages = append(messages, map[string]interface{}{
			"role":    m.Role,
			"content": m.Content,
		})
	}
	params := map[string]interface{}{
		"model":    "gpt-3.5-turbo",
		"messages": messages,
	}

	fmt.Println(color.Blue, "Outgoing message:", color.Reset)
	for i, m := range messages {
		fmt.Println(color.Blue, i, m, color.Reset)
	}

	resp, err := client.Post(uri, params)
	if err != nil {
		return nil, err
	}

	fmt.Println(color.Green, "ChatGPT incoming:", resp, color.Reset)

	respStr := resp.Get("choices.0.message").String()
	respMsg := ChatGPTMessage{}
	err = json.Unmarshal([]byte(respStr), &respMsg)
	if err != nil {
		return nil, err
	}
	return &respMsg, nil
}
