export default {
  loading: {
    buttons: true,
    commands: true,
    setCommands: true, // Set commands for the bot automatically (setMyCommands function)
  },
  paths: {
    buttons: "buttons",
    commands: "commands",
  },
  logging: {
    buttonLoad: true,
    commandLoad: true,
    buttonUse: true,
    commandUse: true,
  },
  api: {
    baseUrl: "https://keyauth.win/api/seller",
    timeout: 5000,
  }
}