const Router=require('./_router.js');
const handlers=require('./handlers')

const router=new Router();

router.post('/add',handlers.addContact);
router.post('/recovery',handlers.recovery);

module.exports=router;