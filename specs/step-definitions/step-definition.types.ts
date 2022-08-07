export interface StepDefinitionResponse {
  responseBody: {
    [index: string]: any;
  };
  responseStatus: number;
  responseCookie: string;
}
