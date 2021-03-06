import Note from '../models/note';
import Lane from '../models/lane';
import uuid from 'uuid';


export function addNote(req, res) {
  const { note, laneId } = req.body;
// console.log(note, laneId, req.body);
  if (!note || !note.task || !laneId) {
    res.status(400).end();
  }

  const newNote = new Note({
    task: note.task,
  });

  newNote.id = uuid();
  newNote.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    Lane.findOne({ id: laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      });
  });
}

export function updateNote(req, res) {

  if (!req.params.noteId) {
    res.status(403).end();
  }

  Note.findOneAndUpdate({ id: req.params.noteId},{task: req.body.task}).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.save(() => {
      res.status(200).end();
    });
  });
}

export function deleteNote(req, res) {
  Note.findOne({ id: req.params.noteId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.remove(() => {
      res.status(200).end();
    });
  });
}


export function getSomething(req, res) {
  return res.status(200).end();
}
