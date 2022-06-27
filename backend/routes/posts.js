
const express = require ('express');
const router = express.Router()
const postsCtrl = require('../controllers/posts');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.post('/',auth, multer, postsCtrl.createPosts);
router.get('/',auth, postsCtrl.getAllPosts);
router.get('/user/:userId',auth, postsCtrl.getAllUserPosts);
router.put('/:id', auth, multer, postsCtrl.updatePosts);
router.put('/image/:id', auth, multer, postsCtrl.deleteImage)
router.delete('/:id', auth, postsCtrl.deletePosts);
router.get('/likes/:id', auth, postsCtrl.getAllUserLike);
router.post('/:id', auth, postsCtrl.likePosts);
router.post('/liked/:id', auth, postsCtrl.liked)



module.exports = router
