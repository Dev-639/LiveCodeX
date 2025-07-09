import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

export const getProjects=async(
    req: Request,
    res: Response,
): Promise<void> =>{
    try {
        const projects=await prisma.project.findMany();
        res.json(projects);

    } catch (error) {
        res.status(500).json({message: "Error getting Projects"});
    }
};

export const createProjects=async(
    req: Request,
    res: Response,
): Promise<void> =>{
    const {id, name, description, startDate, endDate}=req.body;
    try {
        const newProject=await prisma.project.create({
            data: {
                id,
                name,
                description,
                startDate,
                endDate,
            }
        },);
        res.json(newProject);

    } catch (error: any) {
        res.status(500).json({message: `Error creating Projects ${error.message}`});
    }
};