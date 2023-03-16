import { Router, Request, Response } from 'express';


const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  res.send({ ok: true });
});




export default router;