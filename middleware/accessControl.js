module.exports = (req, res, next) => {
  const roomId = parseInt(req.params.id);
  const currentRoom = req.user.currentRoom;

  if (roomId > currentRoom) {
    return res.status(403).json({ error: "You haven't reached this room yet." });
  }

  next();
};
