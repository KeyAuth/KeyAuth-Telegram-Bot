export default {
  loading: {
    buttons: true, // If set to false, the bot will not load buttons
    commands: true, // If set to false, the bot will not load commands
    setCommands: true, // Set commands for the bot automatically (setMyCommands function)
  },
  paths: {
    buttons: "buttons", // Path to the buttons directory
    commands: "commands", // Path to the commands directory
  },
  logging: {
    buttonLoad: true, // If set to false, the bot will not log to console when the button is loaded
    commandLoad: true, // If set to false, the bot will not log to console when the command is loaded
    buttonUse: true, // If set to false, the bot will not log to console when the button is used
    commandUse: true, // If set to false, the bot will not log to console when the command is used
  },
  api: {
    baseUrl: "https://keyauth.win/api/seller", // Base Seller API url
    timeout: 5000, // Timeout for API requests in milliseconds (how long the bot will wait for a response from the API)
  }
}