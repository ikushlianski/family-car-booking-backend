export const handler = async (event) => {
  event.response.autoConfirmUser = true;

  return event;
};
