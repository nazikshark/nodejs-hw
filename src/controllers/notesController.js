import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const filter = {};
  if (tag) filter.tag = tag;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(perPage);
  const totalNotes = await Note.countDocuments(filter);
  const totalPages = Math.ceil(totalNotes / Number(perPage));
  const notes = await Note.find(filter).skip(skip).limit(Number(perPage));

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
  const note = await Note.findById(noteId);
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(noteId, req.body, { returnDocument: 'after' });
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);
  if (!note) throw createError(404, 'Note not found');
  res.status(200).json(note);
};