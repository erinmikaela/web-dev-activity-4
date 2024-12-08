const axios = require("axios");

exports.handler = async (event, context) => {
  if (event.path === "/api/champions" && event.httpMethod === "GET") {
    try {
      const response = await axios.get("https://cdn.communitydragon.org/latest/champion/generic/square");
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    } catch (error) {
      console.error("Error fetching champions:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch champions." }),
      };
    }
  }

  // Fallback for unrecognized routes
  return {
    statusCode: 404,
    body: JSON.stringify({ error: "Not Found" }),
  };
};
