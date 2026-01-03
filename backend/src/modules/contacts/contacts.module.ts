import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsController } from './contacts.controller';
import { ContactsProposalsController } from './contacts-proposals.controller';
import { ContactsService } from './contacts.service';
import { ContactsProposalsService } from './contacts-proposals.service';
import { Lead } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { LeadProposal } from './entities/lead-proposal.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, LeadNote, LeadProposal]),
    MailModule,
  ],
  controllers: [ContactsController, ContactsProposalsController],
  providers: [ContactsService, ContactsProposalsService],
  exports: [ContactsService, ContactsProposalsService],
})
export class ContactsModule {}
