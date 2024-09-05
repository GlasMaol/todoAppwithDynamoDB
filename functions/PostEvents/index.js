const { sendResponse, sendError } = require("../../responses/index");
const { db } = require('../../services/index');
const { v4: uuid } = require('uuid');

exports.handler = async (event) => {

    try {
      const { artist, date, venu, times, price } = JSON.parse(event.body);

      //checks whether all fields are entered.
      if(!artist || !date || !venu || !times || !price) {
        return sendError(400, { succes : false, message : 'Missing required fields' });
      }

      const id = uuid().substring(0, 5);

      await db.put({
        TableName: 'events-db',
        Item: {
          id: id,
          artist: artist,
          date: date,
          venu: venu,
          times: times,
          price: price
        }
      });
      return sendResponse(200, { success: true })
    } catch (error) {
      return sendError(404, { success: false, message: error.message });
    }
  };
