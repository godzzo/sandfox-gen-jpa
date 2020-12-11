import { ParseDomain } from '../../src/data/main';

const data: any[][] = [
	[
		{
			pos: 0,
			name: 'user',
			caption: 'Felhasználó',
			menu: 'yes',
			groups: 'system_group',
		},
		{
			pos: 0,
			name: 'game',
			caption: 'Játék',
			menu: 'yes',
			groups: 'system_group',
		},
		{
			pos: 0,
			name: 'category',
			caption: 'Kategóriák',
			menu: 'yes',
			groups: 'system_group',
		},
		{
			pos: 0,
			name: 'game_category',
			caption: 'Játék kategóriái',
			menu: 'no',
			groups: 'system_group',
		},
		{
			pos: 0,
			name: 'menu',
			caption: 'Menü',
			menu: 'yes',
			groups: 'system_group',
		},
	],
	[
		{
			table: 'user',
			name: 'id',
			caption: 'Azonosító',
			domain: 'd.id',
			needed: 'yes',
		},
		{
			table: 'user',
			name: 'name',
			caption: 'Név',
			domain: 'd.longText',
			needed: 'yes',
		},
		{
			table: 'user',
			name: 'passwd',
			caption: 'Jelszó',
			domain: 'd.shortText',
			needed: 'yes',
			writeonly: 'yes',
		},
		{
			table: 'user',
			name: 'is_active',
			caption: 'Kell levétel dátuma?',
			domain: 'd.boolean',
			needed: 'no',
		},
		{
			table: 'game',
			name: 'id',
			caption: 'Azonosító',
			domain: 'd.id',
			needed: 'yes',
		},
		{
			table: 'game',
			name: 'name',
			caption: 'Név',
			domain: 'd.longText',
			needed: 'yes',
		},
		{
			table: 'game',
			name: 'description',
			caption: 'Leírás',
			domain: 'd.largeText',
			needed: 'no',
		},
		{
			table: 'game',
			name: 'menu_id',
			caption: 'Menü',
			type: 'relation.one.menu',
			kttype: 'Int',
			needed: 'yes',
		},
		{
			table: 'game_category',
			name: 'id',
			caption: 'Azonosító',
			domain: 'd.id',
			needed: 'yes',
		},
		{
			table: 'game_category',
			name: 'rate',
			caption: 'Értékelés',
			domain: 'd.number',
			needed: 'yes',
		},
		{
			table: 'game_category',
			name: 'game_id',
			caption: 'Játék',
			type: 'relation.one.game',
			kttype: 'Int',
			needed: 'yes',
		},
		{
			table: 'game_category',
			name: 'category_id',
			caption: 'Kategória',
			type: 'relation.one.category',
			kttype: 'Int',
			needed: 'yes',
		},
		{
			table: 'category',
			name: 'id',
			caption: 'Azonosító',
			domain: 'd.id',
			needed: 'yes',
		},
		{
			table: 'category',
			name: 'name',
			caption: 'Név',
			domain: 'd.longText',
			needed: 'yes',
		},
		{
			table: 'menu',
			name: 'id',
			caption: 'Azonosító',
			domain: 'd.id',
			needed: 'yes',
		},
		{
			table: 'menu',
			name: 'name',
			caption: 'Név',
			domain: 'd.longText',
			needed: 'yes',
		},
		{
			table: 'system_group',
			name: 'logic_remove',
			caption: 'Logikai törlés',
			domain: 'd.number',
			needed: 'yes',
		},
		{
			table: 'system_group',
			name: 'created',
			caption: 'Készítés dátuma',
			domain: 'd.date',
			needed: 'no',
		},
		{
			table: 'system_group',
			name: 'last_modified',
			caption: 'Utolsó módosítás dátuma',
			domain: 'd.date',
			needed: 'no',
		},
		{
			table: 'system_group',
			name: 'creator_id',
			caption: 'Készítő felhasználó',
			type: 'relation.one.user',
			kttype: 'Int',
			needed: 'yes',
		},
		{
			table: 'system_group',
			name: 'last_modifier_id',
			caption: 'Utolsó módosító felhasználó',
			type: 'relation.one.user',
			kttype: 'Int',
			needed: 'yes',
		},
		{
			table: 'domain',
			name: 'd.id',
			type: 'primary',
			kttype: 'Int',
		},
		{
			table: 'domain',
			name: 'd.number',
			type: 'number',
			kttype: 'Int',
		},
		{
			table: 'domain',
			name: 'd.boolean',
			type: 'Boolean',
			kttype: 'Boolean',
		},
		{
			table: 'domain',
			name: 'd.shortText',
			type: 'string',
			kttype: 'String',
			length: 50,
		},
		{
			table: 'domain',
			name: 'd.longText',
			type: 'string',
			kttype: 'String',
			length: 250,
		},
		{
			table: 'domain',
			name: 'd.largeText',
			type: 'string',
			kttype: 'String',
			length: 16000000,
		},
		{
			table: 'domain',
			name: 'd.date',
			type: 'Date',
			kttype: 'ZonedDateTime',
		},
	],
];

describe('test ParseDomain', function () {
	it('simple', function () {
		const config = ParseDomain([[...data[1]]], data[1][0]);

		console.log('Configured column', config);

		// expect(config).toBe(7);
	});
});
