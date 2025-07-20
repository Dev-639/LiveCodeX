import { Router } from "express";
import { createTasks, getTasks, getUserTasks, updateTaskStatus } from "../controllers/taskController";


const router=Router();
router.get("/", getTasks);
router.post("/", createTasks);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);

export default router;