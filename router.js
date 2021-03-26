const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

//USER RELATED ROUTES
router.get('/', userController.home)
router.get('/sign_in',userController.reg)
router.get('/cancel', userController.cancel)
router.post('/register', userController.register)
router.post('/login',userController.login)
router.post('/logout', userController.logout)
router.post("/create-item", postController.create);
router.post('/update_item',postController.update)
router.post('/delete_item',postController.delete)

// router.get('/post/:id', postController.viewSingle)

module.exports = router



