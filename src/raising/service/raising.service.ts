import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRaisingDto } from '../dto/create-raising.dto';
import { Raising } from '../schemas/raising.schema';
import { UpdateRaisingDto } from '../dto/update-raising.dto';
import { TicketNotFoundException, DuplicateTicketException, InvalidDocumentException } from '../exceptions/raising.exceptions';
import { TicketGenerator } from '../utils/ticket-generator';

interface SuccessResponse {
    success: boolean;
    message: string;
    data?: any;
}

@Injectable()
export class RaisingService {
    constructor(
        @InjectModel(Raising.name) private readonly raisingModel: Model<Raising>,
    ) { }

    async create(createRaisingDto: CreateRaisingDto): Promise<SuccessResponse> {
        try {
            let isUnique = false;
            let generatedTicketId: string;

            while (!isUnique) {
                generatedTicketId = TicketGenerator.generateTicketId();
                const existingTicket = await this.raisingModel.findOne({ ticket_id: generatedTicketId }).exec();
                if (!existingTicket) {
                    isUnique = true;
                }
            }

            createRaisingDto.ticket_id = generatedTicketId;

            if (createRaisingDto.documents) {
                this.validateDocuments(createRaisingDto.documents);
            }

            const newRaising = new this.raisingModel(createRaisingDto);
            const savedRaising = await newRaising.save();

            return {
                success: true,
                message: `Ticket ${generatedTicketId} has been created successfully`,
                data: savedRaising
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Failed to create ticket', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<SuccessResponse> {
        try {
            const tickets = await this.raisingModel.find().exec();
            return {
                success: true,
                message: `Retrieved ${tickets.length} tickets successfully`,
                data: tickets
            };
        } catch (error) {
            throw new HttpException('Failed to fetch tickets', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: string): Promise<SuccessResponse> {
        try {
            const raising = await this.raisingModel.findById(id).exec();
            if (!raising) {
                throw new TicketNotFoundException(id);
            }
            return {
                success: true,
                message: `Ticket ${raising.ticket_id} retrieved successfully`,
                data: raising
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Failed to fetch ticket', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, updateRaisingDto: UpdateRaisingDto): Promise<SuccessResponse> {
        try {
            if (updateRaisingDto.documents) {
                this.validateDocuments(updateRaisingDto.documents);
            }

            const updatedRaising = await this.raisingModel
                .findByIdAndUpdate(id, updateRaisingDto, { new: true })
                .exec();

            if (!updatedRaising) {
                throw new TicketNotFoundException(id);
            }

            return {
                success: true,
                message: `Ticket ${updatedRaising.ticket_id} has been updated successfully`,
                data: updatedRaising
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Failed to update ticket', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<SuccessResponse> {
        try {
            const deletedTicket = await this.raisingModel.findByIdAndDelete(id).exec();
            if (!deletedTicket) {
                throw new TicketNotFoundException(id);
            }
            return {
                success: true,
                message: `Ticket ${deletedTicket.ticket_id} has been deleted successfully`
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Failed to delete ticket', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private validateDocuments(documents: any[]): void {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        documents.forEach(doc => {
            if (!allowedMimeTypes.includes(doc.mimetype)) {
                throw new InvalidDocumentException(`Invalid file type: ${doc.mimetype}`);
            }
            if (doc.size > maxFileSize) {
                throw new InvalidDocumentException(`File size exceeds 5MB limit: ${doc.filename}`);
            }
        });
    }
}