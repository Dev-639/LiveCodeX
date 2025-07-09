"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.createTasks = exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.query;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            }
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Error getting tasks" });
    }
});
exports.getTasks = getTasks;
const createTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, description, status, priority, tags, startDate, dueDate, projectId, authorUserId, assignedUserId, } = req.body;
    try {
        const newTask = yield prisma.task.create({
            data: {
                id,
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                projectId,
                authorUserId,
                assignedUserId,
            }
        });
        res.json(newTask);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating Tasks ${error.message}` });
    }
});
exports.createTasks = createTasks;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = yield prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
            },
        });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: `Error updating tasks ${error.message}` });
    }
});
exports.updateTaskStatus = updateTaskStatus;
