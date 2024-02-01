module.exports.run = async (event, context) => {
  const time = new Date();
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messsage: "Hello guyss" }),
  };
};
