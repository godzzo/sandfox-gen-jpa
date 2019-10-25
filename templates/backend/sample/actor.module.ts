import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { Actor } from './actor.sakila.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor], 'sakilaConnection')],
  providers: [ActorService],
  controllers: [ActorController],
})
export class ActorModule {}
