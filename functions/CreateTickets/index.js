const { sendResponse, sendError } = require("../../responses/index");
const { db } = require('../../services/index');

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const { tickets } = JSON.parse(event.body || '{}');

    if (!id) {
      return sendError(400, { success: false, message: 'Event ID is required!' });
    }

    const result = await db.get({
      TableName: 'events-db',
      Key: { id: id }
    });

    const eventItem = result.Item;

    if (!eventItem) {
      return sendError(404, { success: false, message: 'Event not found!' });
    }

    const numTickets = parseInt(tickets) || 1;

    const generatedTickets = Array.from({ length: numTickets }, () => {
      const ticketNumber = Math.floor(1000 + Math.random() * 9000).toString();
      return {
        ticketNumber: ticketNumber,
        eventId: id,
        status: 'unused'
      };
    });

    for (const ticket of generatedTickets) {
      await db.put({
        TableName: 'events-db',
        Item: ticket
      });
    }

    return sendResponse(200, { data: eventItem, tickets: generatedTickets });

  } catch (error) {
    return sendError(500, { success: false, message: 'Internal server error: ' + error.message });
  }
};