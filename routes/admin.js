const express = require('express');
const Request = require('../db/models/requestModel');
const { isAdmin } = require('../middleware/middleware');
const {
  adminLogin, adminSignup, showReq, updReq, search,
} = require('../controllers/contradmin');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', adminLogin);

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.cookie('Cookie111', '00', { expires: new Date() });
  res.redirect('/');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', adminSignup);

/**
 * Вместо несколих роутов для категорий,
 * сделал один используя query
 */
router.get('/requests', isAdmin, async (req, res, next) => {
  const { status } = req.query;
  try {
    if (!status) {
      const request = await Request.find().lean();
      request.sort((a,b) => b.createdAt - a.createdAt); 
      return res.render('requests', { request: request.map((el) => ({...el, createdAt: new Date(el.createdAt).toLocaleDateString()})) });
    }
    if (status == 'all') {
      const request = await Request.find().lean();
      request.sort((a,b) => b.createdAt - a.createdAt); 
      return res.render('search', { request: request.map((el) => ({...el, createdAt: new Date(el.createdAt).toLocaleDateString() })), layout: false });
    }
    const request = await Request.find({ status }).lean();
    request.sort((a,b) => b.createdAt - a.createdAt); 
    return res.render('search', { request: request.map((el) => ({...el, createdAt: new Date(el.createdAt).toLocaleDateString() })), layout: false });
  } catch (err) {
    err.status = 404;
    err.message = 'There is no search with this status';
    next(err);
  }
});

router.post('/requests', search);

router.get('/requests/s/', (req, res) => {
  // const { id } = req.params;
  res.sendStatus(200);
  // res.redirect(`/admin/requests/${id}`);
});

router.get('/requests/:idreq', showReq);

// router.get('/requests/:idreq/edit', editReq);

router.post('/requests/:idreq', updReq);

module.exports = router;
