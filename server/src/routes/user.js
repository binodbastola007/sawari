const express = require('express')
const router = express.Router()
const {registerNewUser,loginUser , updateUsersDetails ,
   getUserById , uploadImage , getUserImage ,
   getRides, registerVehicleInfo , getVehicleInfo} = require('../controllers/user')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/avatar/')
    },
    filename: function (req, file, cb) {
        const imageName = Math.floor(Math.random()*10) + file.originalname
        cb(null, imageName)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/users/:id' , getUserById);


router.post('/register',registerNewUser);
     
     
router.post('/login',loginUser );


router.put('/account/:id', updateUsersDetails );
     
    
router.post('/users-image/:id',upload.single('avatar'),uploadImage)


router.get('/users-image/:id',upload.single('avatar'),getUserImage)

router.post('/vehicle-info',registerVehicleInfo)

router.get('/vehicle-info',getVehicleInfo);

router.get('/rides',getRides);


module.exports = router;