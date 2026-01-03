import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { LeadProposal } from './entities/lead-proposal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, LeadNote, LeadProposal]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
