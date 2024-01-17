import express from 'express';

const apiRouter: express.Router=express.Router();



apiRouter.get('/',(req:express.Request,resp:express.Response)=>{
    resp.status(200).send("Router get api working")

});
apiRouter.get('/test',(req:express.Request,resp:express.Response)=>{
    resp.status(200).send("Router get test api working")

});




export default apiRouter;