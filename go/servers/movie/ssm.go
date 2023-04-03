package main

import (
	"context"

	aws "github.com/aws/aws-sdk-go-v2/config"
	ssm "github.com/aws/aws-sdk-go-v2/service/ssm"
)

func getSSMParameter(name string) (string, error) {
	config, err := aws.LoadDefaultConfig(context.TODO())
	if err != nil {
		return "", err
	}
	client := ssm.NewFromConfig(config, func(o *ssm.Options) {})
	decrypt := true
	val, err := client.GetParameter(context.TODO(), &ssm.GetParameterInput{
		Name:           &name,
		WithDecryption: &decrypt,
	})
	if err != nil {
		return "", err
	}
	return *val.Parameter.Value, nil
}
