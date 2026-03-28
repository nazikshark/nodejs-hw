import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (Number(page) - 1) * Number(perPage);

  let query = Note.find().where('userId').equals(req.user._id);

  if (tag) query = query.where('tag').equals(tag);
  if (search) query = query.where('$text', { $search: search });

  const totalNotes = await Note.countDocuments(query.getFilter());
  const notes = await query.skip(skip).limit(Number(perPage));
  const totalPages = Math.ceil(totalNotes / Number(perPage));

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { returnDocument: 'after' }
  );
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json(note);
};