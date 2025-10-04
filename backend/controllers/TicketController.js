let tickets = [];

export const addTickets = (newTickets = []) => {
  tickets.push(...newTickets);
  return tickets;
};

export const getTickets = (req, res) => {
  res.json({ success: true, tickets });
};

export const getTicketById = (req, res) => {
  const { id } = req.params;
  const ticket = tickets.find((t) => String(t.id) === String(id));
  if (!ticket)
    return res
      .status(404)
      .json({ success: false, message: "Ticket not found" });
  res.json({ success: true, ticket });
};
