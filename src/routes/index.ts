// import apikey from '../auth/apikey';
import express from 'express';
// import Logger from '../core/Logger';
import userRouter from './user'


const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
// router.use('/', apikey);
// router.use('/', (req, res, next) => {
//   Logger.info('v1 routes working')
//   res.send('v1 routes working')
// })
/*-------------------------------------------------------------------------*/
// router.get('/', (req, res, next) => {
//   Logger.info('router working///')
//   res.send('router working///')
// })
// router.get('/getToken', apikey)
router.use('/users', userRouter)
// router.use('/signup', signup);

export default router;
