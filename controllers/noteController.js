const Note = require('../models/note');

exports.addNote = async (req, res) => {
  const { content, applicationId } = req.body;
  const note = await Note.create({ content, applicationId });
  res.status(201).send(note);
};

exports.getNotes = async (req, res) => {
  const notes = await Note.findAll();
  res.send(notes);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note) {
    return res.status(404).send({ error: 'Note not found.' });
  }
  await note.destroy();
  res.send({ message: 'Note deleted successfully.' });
};