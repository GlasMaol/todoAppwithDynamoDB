const { sendResponse, sendError } = require("../../responses/index");
const { db } = require('../../services/index');

exports.handler = async (event) => {
  try {

    const { Items } = await db.scan({
      TableName: 'events-db',
      FilterExpression: 'attribute_exists(#DYNOBASE_artist)',
      ExpressionAttributeNames: {
        '#DYNOBASE_artist': 'artist'
      }
    });

    if (Items) {
      return sendResponse(200, Items);
    } else {
      sendError(404, { success: false, message: 'No eventsfound!' });
    }
  } catch (error) {
    return sendError(404, { success: false, message: error.message });
  }
};
