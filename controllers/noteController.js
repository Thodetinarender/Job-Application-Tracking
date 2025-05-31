const Note = require('../models/note');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      content: req.body.content,
      applicationId: req.body.applicationId,
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notes for an application
exports.getNotesByApplication = async (req, res) => {
  try {
    const notes = await Note.find({ applicationId: req.params.applicationId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// const Note = require('../models/note');

// exports.addNote = async (req, res) => {
//   const { content, applicationId } = req.body;
//   const note = await Note.create({ content, applicationId });
//   res.status(201).send(note);
// };

// exports.getNotes = async (req, res) => {
//   const notes = await Note.findAll();
//   res.send(notes);
// };

// exports.deleteNote = async (req, res) => {
//   const note = await Note.findByPk(req.params.id);
//   if (!note) {
//     return res.status(404).send({ error: 'Note not found.' });
//   }
//   await note.destroy();
//   res.send({ message: 'Note deleted successfully.' });
// };