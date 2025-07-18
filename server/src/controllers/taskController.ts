import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

export const getTasks=async(
    req: Request,
    res: Response,
): Promise<void> =>{
    const {projectId}=req.query;
    try {
        const tasks=await prisma.task.findMany({
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

    } catch (error) {
        res.status(500).json({message: "Error getting tasks"});
    }
};


export const createTasks=async(
    req: Request,
    res: Response,
): Promise<void> =>{
    const {
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
    }=req.body;
    try {
        const newTask=await prisma.task.create({
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
        },);
        res.json(newTask);

    } catch (error: any) {
        res.status(500).json({message: `Error creating Tasks ${error.message}`});
    }
};


export const updateTaskStatus=async(
    req: Request,
    res: Response,
): Promise<void> =>{
    const {taskId}=req.params;
    const {status}=req.body;
    try {
        const updatedTask=await prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status : status,
            },
        });
        res.status(200).json(updatedTask);
    } catch (error: any) {
        res.status(500).json({message: `Error updating tasks ${error.message}`});
    }
};
