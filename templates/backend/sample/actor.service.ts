import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, DeleteResult } from 'typeorm';
import { Actor } from './actor.sakila.entity';

@Injectable()
export class ActorService {
	constructor(
		@InjectRepository(Actor)
		private readonly actorRepository: Repository<Actor>,
	) { }

	async findAll(): Promise<Actor[]> {
		return await this.actorRepository.find();
	}

	async find(filters: any) : Promise<Actor[]> {

		const cfg : any = { where: filters };

		if (filters.skip) {
			cfg.skip = parseInt(filters.skip);
		}

		if (filters.take) {
			cfg.take = parseInt(filters.take);
		}

		console.log(JSON.stringify(cfg));

		return await this.actorRepository.find(cfg);
	}

	async insert(params: any) : Promise<InsertResult> {
		return await this.actorRepository.insert(params);
	}

	async save(params: any) : Promise<Actor> {
		// const item = await this.actorRepository.preload(params);

		const item = this.actorRepository.create();

		this.actorRepository.merge(item, params);

		if (typeof item.id === "string") {
			item.id = parseInt(item.id);
		}

		console.log(`item: ${item.id} : ${typeof(item.id)}, ${item.firstName}, ${item.lastName}`);

		return await this.actorRepository.save(item);
	}

	async delete(id: number) : Promise<DeleteResult> {	
		return await this.actorRepository.delete(id);
	}
}