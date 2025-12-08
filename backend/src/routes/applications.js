const express = require('express');
const { randomUUID } = require('crypto');
const authMiddleware = require('../middleware/auth');
const {
  getApplicationsForUser,
  addApplication,
  updateApplication,
  deleteApplication,
} = require('../data/store');

const router = express.Router();
const VALID_STATUSES = ['Applied', 'Interview', 'Rejected', 'Offer'];

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    console.log('[applications] GET /applications', { userId: req.user.id });
    const applications = await getApplicationsForUser(req.user.id);
    return res.json(applications);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { company, role, status, appliedDate, deadline, notes } = req.body;
    console.log('[applications] POST /applications', {
      userId: req.user.id,
      body: { company, role, status, appliedDate, deadline, notes },
    });

    if (!company || !role || !status || !appliedDate) {
      return res
        .status(400)
        .json({ message: 'company, role, status, and appliedDate are required' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VALID_STATUSES.join(', ')}` });
    }

    const newApplication = {
      id: randomUUID(),
      userId: req.user.id,
      company,
      role,
      status,
      appliedDate,
      deadline: deadline || null,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addApplication(newApplication);
    console.log('[applications] created', { userId: req.user.id, id: newApplication.id });
    return res.status(201).json(newApplication);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company, role, status, appliedDate, deadline, notes } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VALID_STATUSES.join(', ')}` });
    }

    const updates = {
      ...(company !== undefined ? { company } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(appliedDate !== undefined ? { appliedDate } : {}),
      ...(deadline !== undefined ? { deadline } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateApplication(req.user.id, id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteApplication(req.user.id, id);

    if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

