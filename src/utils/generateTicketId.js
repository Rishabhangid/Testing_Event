const generateTicketId = () => {
    return Math.floor(10000000 + Math.random() * 90000000); // Generates a random 8-digit number
  };
  module.exports = generateTicketId;