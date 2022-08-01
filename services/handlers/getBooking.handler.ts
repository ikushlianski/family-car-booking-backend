import { APIGatewayEvent } from "aws-lambda";

exports.handler = async function (event: APIGatewayEvent) {
  return {
    statusCode: 200,
    body: "local testing. A single booking will be returned",
  };
};
