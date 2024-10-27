interface CharactersListResponse {
	info: Info;
	results: Character[];
}

interface ResourceBase {
	id: number;
	name: string;
	url: string;
	created: string;
}

interface Info {
	count: number;
	pages: number;
	next: string;
	prev: string;
}

interface Character extends ResourceBase {
	status: 'Alive' | 'Dead' | 'unknown';
	species: string;
	type: string;
	gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
	origin: {
		name: string;
		url: string;
	};
	location: {
		name: string;
		url: string;
	};
	image: string;
	episode: string[];
}

export type { Info, Character, CharactersListResponse };
