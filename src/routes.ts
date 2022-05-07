import { prisma } from './prisma';
import nodemailer from 'nodemailer';
import express from 'express';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feeedbacks-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';

export const routes = express.Router();

routes.get('/feedbacks', async (req, res) => {
    res.send('Hello World!');
});

routes.post('/feedbacks', async (req, res) => {
    const { type, comment, screenshot } = req.body;

    try {
        const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
        const nodemailerMailAdapter = new NodemailerMailAdapter();
        const submitFeedbackUseCase = new SubmitFeedbackUseCase(
            prismaFeedbacksRepository,
            nodemailerMailAdapter,
        );

        await submitFeedbackUseCase.execute({
            type,
            comment,
            screenshot,
        });

        return res.status(201).send();
    } catch (error) {
        throw new Error('Error sending new feedback');
    }
});
